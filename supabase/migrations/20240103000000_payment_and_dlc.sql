-- Migration: Payment and DLC Support
-- Adds roles and entitlement tracking for premium content

-- 1. Extend Player Profiles with Roles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='player_profiles' AND column_name='role') THEN
        ALTER TABLE public.player_profiles ADD COLUMN role TEXT DEFAULT 'player';
    END IF;
END $$;

-- 2. Content Packs (Registry of purchasable IDs)
CREATE TABLE IF NOT EXISTS public.content_packs (
    id TEXT PRIMARY KEY, -- e.g. 'premium_base', 'dlc_realm_2'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Content Pack Prices (Multi-currency support)
CREATE TABLE IF NOT EXISTS public.content_pack_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_pack_id TEXT REFERENCES public.content_packs(id) ON DELETE CASCADE,
    currency TEXT NOT NULL, -- e.g. 'SEK', 'USD'
    amount_cents INTEGER NOT NULL, -- Price in cents (8900 = 89 SEK)
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(content_pack_id, currency)
);

-- 4. Player Entitlements
CREATE TABLE IF NOT EXISTS public.player_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.player_profiles(id) ON DELETE CASCADE,
    content_pack_id TEXT REFERENCES public.content_packs(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ DEFAULT now(),
    stripe_payment_intent_id TEXT,

    UNIQUE(player_id, content_pack_id)
);

-- RLS Policies
ALTER TABLE public.content_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pack_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_entitlements ENABLE ROW LEVEL SECURITY;

-- Everyone can read active content packs and prices
DROP POLICY IF EXISTS "Public can view active content packs" ON public.content_packs;
CREATE POLICY "Public can view active content packs"
    ON public.content_packs FOR SELECT
    USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can view pack prices" ON public.content_pack_prices;
CREATE POLICY "Public can view pack prices"
    ON public.content_pack_prices FOR SELECT
    USING (TRUE);

-- Players can view their own entitlements
DROP POLICY IF EXISTS "Players can view own entitlements" ON public.player_entitlements;
CREATE POLICY "Players can view own entitlements"
    ON public.player_entitlements FOR SELECT
    USING (auth.uid() = player_id);

-- Only service role or authorized edge functions (via service role) should insert entitlements
-- (Standard RLS policies for INSERT are omitted to ensure only the server handles this)

-- 5. Helper function for access check (supporting tester/admin bypass)
CREATE OR REPLACE FUNCTION public.has_content_access(p_player_id UUID, p_content_pack_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
    v_owns BOOLEAN;
BEGIN
    -- Check if user is a tester/admin
    SELECT role INTO v_role FROM public.player_profiles WHERE id = p_player_id;
    IF v_role IN ('tester', 'admin') THEN
        RETURN TRUE;
    END IF;

    -- Check if user owns the pack
    SELECT EXISTS (
        SELECT 1 FROM public.player_entitlements
        WHERE player_id = p_player_id AND content_pack_id = p_content_pack_id
    ) INTO v_owns;

    RETURN v_owns;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed initial data
INSERT INTO public.content_packs (id) VALUES ('premium_base') ON CONFLICT DO NOTHING;
INSERT INTO public.content_pack_prices (content_pack_id, currency, amount_cents)
VALUES ('premium_base', 'SEK', 8900)
ON CONFLICT (content_pack_id, currency) DO UPDATE SET amount_cents = EXCLUDED.amount_cents;
