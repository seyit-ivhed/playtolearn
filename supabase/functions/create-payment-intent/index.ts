import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.12.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers })
    }

    try {
        const { contentPackId } = await req.json()

        // Get user from token
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Missing Authorization header')

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // 1. Get player profile ID from Auth ID
        const { data: profile, error: profileError } = await supabaseClient
            .from('player_profiles')
            .select('id')
            .eq('auth_id', user.id)
            .single()

        if (profileError || !profile) throw new Error('Player profile not found')

        // 2. Get content pack price from DB
        const { data: pack, error: packError } = await supabaseClient
            .from('content_pack_prices')
            .select('amount_cents, currency')
            .eq('content_pack_id', contentPackId)
            .eq('currency', 'SEK') // Default to SEK for now
            .single()

        if (packError || !pack) {
            return new Response(JSON.stringify({ error: 'Content pack price not found' }), {
                status: 404,
                headers: { ...headers, 'Content-Type': 'application/json' },
            })
        }

        // Create a PaymentIntent with the specific amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: pack.amount_cents,
            currency: pack.currency.toLowerCase(),
            payment_method_types: ['card', 'klarna', 'swish'],
            metadata: {
                playerId: profile.id,
                contentPackId: contentPackId,
            },
        })

        return new Response(
            JSON.stringify({ clientSecret: paymentIntent.client_secret }),
            { headers: { ...headers, 'Content-Type': 'application/json' } }
        )
    } catch (error: any) {
        console.error('Error creating payment intent:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
        })
    }
})
