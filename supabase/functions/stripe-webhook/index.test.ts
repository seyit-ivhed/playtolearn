import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { processEvent } from "./index.ts";

/**
 * Tests the processEvent logic in isolation by mocking the Supabase client.
 * This ensures we can verify the business logic (status updates, entitlements)
 * without a real database or Stripe signature verification.
 */
Deno.test("stripe-webhook processEvent - successful payment_intent.succeeded", async () => {
    // 1. Mock supabaseAdmin (minimal client needed for the logic)
    const mockSupabaseAdmin = {
        from: (table: string) => {
            if (table === 'purchase_intents') {
                return {
                    update: (_updates: any) => ({
                        eq: (_col: string, _val: any) => ({
                            select: (_cols: string) => ({
                                maybeSingle: async () => ({ data: { id: 'intent-123' }, error: null })
                            })
                        })
                    })
                };
            }
            if (table === 'player_entitlements') {
                return {
                    upsert: async (_data: any, _opts: any) => ({ error: null })
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
    const result = await processEvent(event, mockSupabaseAdmin as any);

    // 4. Assertions
    assertEquals(result.received, true);
    assertEquals(result.error, undefined);
});

Deno.test("stripe-webhook processEvent - fails if missing metadata", async () => {
    const event = {
        type: 'payment_intent.succeeded',
        data: {
            object: {
                id: 'pi_mock',
                metadata: {} // Missing playerId and contentPackId
            }
        }
    };

    const result = await processEvent(event, {} as any);

    assertEquals(result.status, 400);
    assertEquals(result.error, "Missing metadata");
});

Deno.test("stripe-webhook processEvent - handles payment failure gracefully", async () => {
    const mockSupabaseAdmin = {
        from: (_table: string) => ({
            update: (_updates: any) => ({
                eq: (_col: string, _val: any) => ({
                    select: (_cols: string) => ({
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

    const result = await processEvent(event, mockSupabaseAdmin as any);

    assertEquals(result.received, true);
    assertEquals(result.error, undefined);
});
