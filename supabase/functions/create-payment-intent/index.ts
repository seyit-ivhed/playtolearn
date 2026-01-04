import Stripe from 'npm:stripe@^14.0.0'
import { createClient } from 'npm:@supabase/supabase-js@^2.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '')


Deno.serve(async (req: Request) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers })
    }

    try {
        const { contentPackId } = await req.json()

        // Get user from token using Admin Client for better reliability in Edge Functions
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            console.error('Missing Authorization header')
            return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } })
        }

        const jwt = authHeader.replace('Bearer ', '')
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt)
        if (authError || !user) {
            console.error('Auth verification failed:', authError?.message || 'No user returned')
            return new Response(
                JSON.stringify({
                    error: 'Unauthorized',
                    details: authError?.message
                }),
                { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
            )
        }

        console.log('Authorized user:', user.id, 'Email:', user.email)

        // Use a user-scoped client for DB operations to respect RLS if needed, 
        // or just use admin if we want to bypass (but here we should respect RLS)
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        // 1. Get or create player profile ID from Auth ID
        const { data: existingProfile, error: profileError } = await supabaseClient
            .from('player_profiles')
            .select('id')
            .eq('auth_id', user.id)
            .maybeSingle()

        let profile = existingProfile;

        if (profileError) {
            console.error('Error fetching profile:', profileError)
            throw new Error('Database error during profile lookup')
        }

        if (!profile) {
            console.log('No profile found for user, creating one on the fly...')
            const { data: newProfile, error: createError } = await supabaseAdmin
                .from('player_profiles')
                .insert({
                    auth_id: user.id,
                    is_anonymous: false, // They just converted or are regular users
                })
                .select('id')
                .single()

            if (createError) {
                console.error('Failed to create missing profile:', createError)
                throw new Error('Could not initialize player profile')
            }
            profile = newProfile
        }

        if (!profile) throw new Error('Player profile not found')

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
        // We explicitly list the types to avoid certain methods like 'link' 
        // that the user wants to keep hidden, and to handle 'swish' carefully.
        const paymentIntent = await stripe.paymentIntents.create({
            amount: pack.amount_cents,
            currency: pack.currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                playerId: profile.id,
                contentPackId: contentPackId,
            },
        })

        console.log('Created Payment Intent:', paymentIntent.id)

        return new Response(
            JSON.stringify({ clientSecret: paymentIntent.client_secret }),
            { headers: { ...headers, 'Content-Type': 'application/json' } }
        )
    } catch (err: unknown) {
        const error = err as Error;
        console.error('Error creating payment intent:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
        })
    }
})
