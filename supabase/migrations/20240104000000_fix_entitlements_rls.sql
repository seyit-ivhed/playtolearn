-- Fix RLS policy for player_entitlements
-- The previous policy was comparing auth.uid() (Auth ID) to player_id (Profile ID)
-- which resulted in no records being returned to the frontend.

DROP POLICY IF EXISTS "Players can view own entitlements" ON public.player_entitlements;

CREATE POLICY "Players can view own entitlements"
    ON public.player_entitlements FOR SELECT
    USING (
        player_id IN (
            SELECT id FROM public.player_profiles 
            WHERE auth_id = auth.uid()
        )
    );
