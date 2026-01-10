-- Consolidated Schema for Play to Learn Game
-- Includes: Player Profiles, Game States, Content Packs, Purchase Intents, and Entitlements

-- 1. Player Profiles
CREATE TABLE IF NOT EXISTS public.player_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ DEFAULT now(),
    UNIQUE(auth_id)
);

-- 2. Game States
CREATE TABLE IF NOT EXISTS public.game_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.player_profiles(id) ON DELETE CASCADE,
    state_blob JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(player_id)
);

-- 3. Content Packs
CREATE TABLE IF NOT EXISTS public.content_packs (
    id TEXT PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Content Pack Prices
CREATE TABLE IF NOT EXISTS public.content_pack_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_pack_id TEXT REFERENCES public.content_packs(id) ON DELETE CASCADE,
    currency TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(content_pack_id, currency)
);

-- 5. Purchase Intents
CREATE TABLE IF NOT EXISTS public.purchase_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.player_profiles(id) ON DELETE CASCADE,
    content_pack_id TEXT REFERENCES public.content_packs(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'abandoned')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB
);

-- 6. Player Entitlements
CREATE TABLE IF NOT EXISTS public.player_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.player_profiles(id) ON DELETE CASCADE,
    content_pack_id TEXT REFERENCES public.content_packs(id) ON DELETE CASCADE,
    purchase_intent_id UUID REFERENCES public.purchase_intents(id) ON DELETE SET NULL,
    purchased_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(player_id, content_pack_id)
);

-- RLS Enablement
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pack_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_entitlements ENABLE ROW LEVEL SECURITY;

-- Indices
CREATE INDEX IF NOT EXISTS idx_purchase_intents_player_pack_status 
ON public.purchase_intents (player_id, content_pack_id) 
WHERE status = 'pending';

-- RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON public.player_profiles FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update own profile" ON public.player_profiles FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Users can insert own profile" ON public.player_profiles FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Game States
CREATE POLICY "Users can view own game state" ON public.game_states FOR SELECT TO authenticated 
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));
CREATE POLICY "Users can insert own game state" ON public.game_states FOR INSERT TO authenticated 
WITH CHECK (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));
CREATE POLICY "Users can update own game state" ON public.game_states FOR UPDATE TO authenticated 
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));

-- Content
CREATE POLICY "Public can view active content packs" ON public.content_packs FOR SELECT TO authenticated USING (is_active = TRUE);
CREATE POLICY "Public can view pack prices" ON public.content_pack_prices FOR SELECT TO authenticated USING (TRUE);

-- Entitlements
CREATE POLICY "Players can view own entitlements" ON public.player_entitlements FOR SELECT TO authenticated
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));

-- Purchase Intents
CREATE POLICY "Players can view own purchase intents" ON public.purchase_intents FOR SELECT TO authenticated
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));

-- Seed initial data
INSERT INTO public.content_packs (id) VALUES ('premium_base') ON CONFLICT DO NOTHING;
INSERT INTO public.content_pack_prices (content_pack_id, currency, amount_cents)
VALUES ('premium_base', 'SEK', 8900)
ON CONFLICT (content_pack_id, currency) DO UPDATE SET amount_cents = EXCLUDED.amount_cents;
