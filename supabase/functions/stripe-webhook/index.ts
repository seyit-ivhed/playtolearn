import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno&no-check'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    httpClient: Stripe.createFetchHttpClient(),
})
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

Deno.serve(async (req: Request) => {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
        return new Response('Missing stripe-signature', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)

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
                return new Response('Error updating database', { status: 500 })
            }

            console.log(`Entitlement granted: Player ${playerId} -> Pack ${contentPackId} `)
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message} `)
        return new Response(`Webhook Error: ${err.message} `, { status: 400 })
    }
})
