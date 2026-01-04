import Stripe from 'npm:stripe@^14.0.0'
import { createClient } from 'npm:@supabase/supabase-js@^2.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '')
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

Deno.serve(async (req: Request) => {
    const signature = req.headers.get('stripe-signature')
    console.log('Incoming webhook request. Signature present:', !!signature)

    if (!signature) {
        console.error('Missing stripe-signature header')
        return new Response('Missing stripe-signature', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret)

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object
            const { playerId, contentPackId } = paymentIntent.metadata

            if (!playerId || !contentPackId) {
                console.warn('Payment intent missing metadata:', paymentIntent.id)
                return new Response('Missing metadata', { status: 400 })
            }

            // Use Service Role Key to bypass RLS and insert entitlement
            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )

            const { error } = await supabaseAdmin
                .from('player_entitlements')
                .upsert({
                    player_id: playerId,
                    content_pack_id: contentPackId,
                    stripe_payment_intent_id: paymentIntent.id,
                }, { onConflict: 'player_id, content_pack_id' })

            if (error) {
                console.error('Error inserting entitlement:', error)
                return new Response(`Error updating database: ${error.message}`, { status: 500 })
            }

            console.log(`SUCCESS: Entitlement granted for Player ${playerId} (Pack: ${contentPackId})`)
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`Webhook Error: ${error.message} `)
        return new Response(`Webhook Error: ${error.message} `, { status: 400 })
    }
})
