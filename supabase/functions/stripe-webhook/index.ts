import Stripe from 'npm:stripe@^14.0.0'
import { createClient } from 'npm:@supabase/supabase-js@^2.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '')
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

export const processEvent = async (event: any, supabaseAdmin: any) => {
    if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed' || event.type === 'payment_intent.canceled') {
        const paymentIntent = event.data.object
        const { playerId, contentPackId } = paymentIntent.metadata

        if (!playerId || !contentPackId) {
            console.warn('Payment intent missing metadata:', paymentIntent.id)
            return { error: 'Missing metadata', status: 400 }
        }

        // 1. Update Purchase Intent Status
        let status = 'pending'
        if (event.type === 'payment_intent.succeeded') status = 'succeeded'
        if (event.type === 'payment_intent.payment_failed') status = 'failed'
        if (event.type === 'payment_intent.canceled') status = 'canceled'

        const { data: intent, error: intentError } = await supabaseAdmin
            .from('purchase_intents')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .select('id')
            .maybeSingle()

        if (intentError) {
            console.error('Error updating purchase intent:', intentError)
        }

        // 2. Grant Entitlement if Succeeded
        if (event.type === 'payment_intent.succeeded') {
            const { error: entitlementError } = await supabaseAdmin
                .from('player_entitlements')
                .upsert({
                    player_id: playerId,
                    content_pack_id: contentPackId,
                    purchase_intent_id: intent?.id,
                }, { onConflict: 'player_id, content_pack_id' })

            if (entitlementError) {
                console.error('Error inserting entitlement:', entitlementError)
                return { error: `Error updating database: ${entitlementError.message}`, status: 500 }
            }

            console.log(`SUCCESS: Entitlement granted for Player ${playerId} (Pack: ${contentPackId})`)
        }
    }
    return { received: true }
}

export const handler = async (req: Request) => {
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        console.error('Missing stripe-signature header')
        return new Response('Missing stripe-signature', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret)

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const result = await processEvent(event, supabaseAdmin)

        if (result.error) {
            return new Response(result.error, { status: result.status })
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Webhook Error: ${error.message} `)
        return new Response(`Webhook Error: ${error.message} `, { status: 400 })
    }
}

Deno.serve(handler)
