import { supabase } from './supabase.service';

export const PersistenceService = {
    /**
     * Pushes the current game state to Supabase.
     * Handles both checking for a profile and upserting the state.
     */
    async pushState(authId: string, state: any) {
        try {
            // 1. Get or create the player profile linked to this authId
            const { data: profile, error: profileError } = await supabase
                .from('player_profiles')
                .select('id, device_id')
                .eq('auth_id', authId)
                .maybeSingle();

            if (profileError) throw profileError;

            let playerId = profile?.id;

            // If no profile exists yet, create one
            if (!profile) {
                const { IdentityService } = await import('./identity.service');
                const { data: newProfile, error: createError } = await supabase
                    .from('player_profiles')
                    .insert({
                        auth_id: authId,
                        is_anonymous: true,
                        device_id: IdentityService.getDeviceId()
                    })
                    .select('id')
                    .single();

                if (createError) throw createError;
                playerId = newProfile.id;
            } else if (!profile.device_id) {
                // Backfill device_id if missing from existing profile
                const { IdentityService } = await import('./identity.service');
                await supabase
                    .from('player_profiles')
                    .update({ device_id: IdentityService.getDeviceId() })
                    .eq('id', playerId);
            }

            // 2. Upsert the game state
            const { error: upsertError } = await supabase
                .from('game_states')
                .upsert({
                    player_id: playerId,
                    state_blob: state,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'player_id'
                });

            if (upsertError) throw upsertError;

            return { success: true };
        } catch (error) {
            console.error('Failed to push state to Supabase:', error);
            return { success: false, error };
        }
    },

    /**
     * Pulls the latest game state from Supabase for a given authId.
     */
    async pullState(authId: string) {
        try {
            // Step 1: Get the player profile ID first
            const { data: profile, error: profileError } = await supabase
                .from('player_profiles')
                .select('id')
                .eq('auth_id', authId)
                .maybeSingle();

            if (profileError) throw profileError;
            if (!profile) return null;

            // Step 2: Get the game state for that profile
            const { data, error } = await supabase
                .from('game_states')
                .select('state_blob')
                .eq('player_id', profile.id)
                .maybeSingle();

            if (error) throw error;
            return data?.state_blob || null;
        } catch (error) {
            console.error('Failed to pull state from Supabase:', error);
            return null;
        }
    },

    /**
     * Helper to sync provided state if a session exists.
     * Useful for event-driven syncing from store slices.
     */
    async sync(state: any) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                console.log('Event-driven sync triggered...');
                return this.pushState(session.user.id, state);
            }
        } catch (error) {
            console.error('Error in sync helper:', error);
        }
    }
};
