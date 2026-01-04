-- Initial Schema for Play to Learn Game

-- 1. Player Profiles
-- Links internal Supabase auth to our game-specific player data
CREATE TABLE IF NOT EXISTS public.player_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID, -- Optional: to link anonymous session device
    is_anonymous BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ DEFAULT now(),
    
    -- GDPR compliance fields
    data_deletion_requested_at TIMESTAMPTZ,
    consent_given BOOLEAN DEFAULT FALSE,
    
    UNIQUE(auth_id)
);

-- 2. Game States
-- Stores the flattened JSONB state of Zustand stores
CREATE TABLE IF NOT EXISTS public.game_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.player_profiles(id) ON DELETE CASCADE,
    state_blob JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(player_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Player Profiles: Users can only see and edit their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.player_profiles;
CREATE POLICY "Users can view own profile" 
ON public.player_profiles FOR SELECT 
USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.player_profiles;
CREATE POLICY "Users can update own profile" 
ON public.player_profiles FOR UPDATE 
USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.player_profiles;
CREATE POLICY "Users can insert own profile" 
ON public.player_profiles FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

-- Game States: Users can only see and edit their own game state
DROP POLICY IF EXISTS "Users can view own game state" ON public.game_states;
CREATE POLICY "Users can view own game state" 
ON public.game_states FOR SELECT 
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own game state" ON public.game_states;
CREATE POLICY "Users can insert own game state" 
ON public.game_states FOR INSERT 
WITH CHECK (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own game state" ON public.game_states;
CREATE POLICY "Users can update own game state" 
ON public.game_states FOR UPDATE 
USING (player_id IN (SELECT id FROM public.player_profiles WHERE auth_id = auth.uid()));
