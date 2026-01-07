-- Security Fixes
-- 1. Fix search_path for has_content_access to prevent search-path injection
ALTER FUNCTION public.has_content_access(p_player_id UUID, p_content_pack_id TEXT) SET search_path = public;

-- 2. Restrict RLS policies to authenticated users only (prevents Supabase security warnings)

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.player_profiles;
CREATE POLICY "Users can view own profile" ON public.player_profiles FOR SELECT TO authenticated USING (auth.uid() = auth_id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.player_profiles;
CREATE POLICY "Users can update own profile" ON public.player_profiles FOR UPDATE TO authenticated USING (auth.uid() = auth_id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.player_profiles;
CREATE POLICY "Users can insert own profile" ON public.player_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = auth_id);

-- Game States
DROP POLICY IF EXISTS "Users can view own game state" ON public.game_states;
CREATE POLICY "Users can view own game state" ON public.game_states FOR SELECT TO authenticated 
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert own game state" ON public.game_states;
CREATE POLICY "Users can insert own game state" ON public.game_states FOR INSERT TO authenticated 
WITH CHECK (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update own game state" ON public.game_states;
CREATE POLICY "Users can update own game state" ON public.game_states FOR UPDATE TO authenticated 
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));

-- Content
DROP POLICY IF EXISTS "Public can view active content packs" ON public.content_packs;
CREATE POLICY "Public can view active content packs" ON public.content_packs FOR SELECT TO authenticated USING (is_active = TRUE);
DROP POLICY IF EXISTS "Public can view pack prices" ON public.content_pack_prices;
CREATE POLICY "Public can view pack prices" ON public.content_pack_prices FOR SELECT TO authenticated USING (TRUE);

-- Entitlements
DROP POLICY IF EXISTS "Players can view own entitlements" ON public.player_entitlements;
CREATE POLICY "Players can view own entitlements" ON public.player_entitlements FOR SELECT TO authenticated 
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));

-- Purchase Intents
DROP POLICY IF EXISTS "Players can view own purchase intents" ON public.purchase_intents;
CREATE POLICY "Players can view own purchase intents" ON public.purchase_intents FOR SELECT TO authenticated 
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));
