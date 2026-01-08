import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { processEvent } from "./index.ts";
import { SupabaseClient } from 'npm:@supabase/supabase-js@^2.0.0';
import Stripe from 'npm:stripe@^14.0.0';

/**
 * Tests the processEvent logic in isolation by mocking the Supabase client.
 * This ensures we can verify the business logic (status updates, entitlements)
 * without a real database or Stripe signature verification.
 */
Deno.test({
    name: "stripe-webhook processEvent - successful payment_intent.succeeded",
    sanitizeResources: false,
    sanitizeOps: false,
    async fn() {
        // 1. Mock supabaseAdmin (minimal client needed for the logic)
        const mockSupabaseAdmin = {
            from: (table: string) => {
                if (table === 'purchase_intents') {
                    return {
                        update: () => ({
                            eq: () => ({
                                select: () => ({
                                    maybeSingle: async () => ({ data: { id: 'intent-123' }, error: null })
                                })
                            })
                        })
                    };
                }
                if (table === 'player_entitlements') {
                    return {
                        upsert: async () => ({ error: null })
                    };
                }
                return {};
            }
        };

        // 2. Mock Stripe Event
        const event = {
            type: 'payment_intent.succeeded',
            data: {
                object: {
                    id: 'pi_mock',
                    metadata: {
                        playerId: 'profile-123',
                        contentPackId: 'pack-1'
                    }
                }
            }
        };

        // 3. Invoke processEvent
        const result = await processEvent(event as Stripe.Event, mockSupabaseAdmin as unknown as SupabaseClient);

        // 4. Assertions
        assertEquals(result.received, true);
        assertEquals(result.error, undefined);
    }
});

Deno.test({
    name: "stripe-webhook processEvent - fails if missing metadata",
    sanitizeResources: false,
    sanitizeOps: false,
    async fn() {
        const event = {
            type: 'payment_intent.succeeded',
            data: {
                object: {
                    id: 'pi_mock',
                    metadata: {} // Missing playerId and contentPackId
                }
            }
        };

        const result = await processEvent(event as Stripe.Event, {} as unknown as SupabaseClient);

        assertEquals(result.status, 400);
        assertEquals(result.error, "Missing metadata");
    }
});

Deno.test({
    name: "stripe-webhook processEvent - handles payment failure gracefully",
    sanitizeResources: false,
    sanitizeOps: false,
    async fn() {
        const mockSupabaseAdmin = {
            from: () => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            maybeSingle: async () => ({ data: { id: 'intent-123' }, error: null })
                        })
                    })
                })
            })
        };

        const event = {
            type: 'payment_intent.payment_failed',
            data: {
                object: {
                    id: 'pi_mock',
                    metadata: {
                        playerId: 'profile-123',
                        contentPackId: 'pack-1'
                    }
                }
            }
        };

        const result = await processEvent(event as Stripe.Event, mockSupabaseAdmin as unknown as SupabaseClient);

        assertEquals(result.received, true);
        assertEquals(result.error, undefined);
    }
});
