import { supabase } from './supabase.service';
import { IdentityService } from './identity.service';

export const PersistenceService = {
    /**
     * Fetches or creates a player profile for a given authId.
     * Returns the profile id and role.
     */
    async getOrCreateProfile(authId: string) {
        // 1. Get the player profile linked to this authId
        const { data: profile, error: profileError } = await supabase
            .from('player_profiles')
            .select('id, role, device_id')
            .eq('auth_id', authId)
            .maybeSingle();

        if (profileError) throw profileError;

        if (profile) {
            // Backfill device_id if missing from existing profile
            if (!profile.device_id) {
                await supabase
                    .from('player_profiles')
                    .update({ device_id: IdentityService.getDeviceId() })
                    .eq('id', profile.id);
            }
            return { id: profile.id, role: profile.role };
        }

        // If no profile exists yet, create one
        const { data: newProfile, error: createError } = await supabase
            .from('player_profiles')
            .insert({
                auth_id: authId,
                is_anonymous: true,
                device_id: IdentityService.getDeviceId()
            })
            .select('id, role')
            .single();

        if (createError) throw createError;
        return { id: newProfile.id, role: newProfile.role };
    },

    /**
     * Pushes the current game state to Supabase.
     * Handles both checking for a profile and upserting the state.
     */
    async pushState(authId: string, state: object, playerId?: string) {
        try {
            let actualPlayerId = playerId;

            if (!actualPlayerId) {
                const profile = await this.getOrCreateProfile(authId);
                actualPlayerId = profile.id;
            }

            // 2. Upsert the game state
            const { error: upsertError } = await supabase
                .from('game_states')
                .upsert({
                    player_id: actualPlayerId,
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
    async pullState(authId: string, playerId?: string) {
        let actualPlayerId = playerId;

        if (!actualPlayerId) {
            // Step 1: Get the player profile ID first
            const { data: profile, error: profileError } = await supabase
                .from('player_profiles')
                .select('id')
                .eq('auth_id', authId)
                .maybeSingle();

            if (profileError) throw profileError;
            if (!profile) return null;
            actualPlayerId = profile.id;
        }

        // Step 2: Get the game state for that profile
        const { data, error } = await supabase
            .from('game_states')
            .select('state_blob')
            .eq('player_id', actualPlayerId)
            .maybeSingle();

        if (error) throw error;
        return data?.state_blob || null;
    },

    /**
     * Helper to sync provided state if a session exists.
     * Useful for event-driven syncing from store slices.
     */
    async sync(state: object) {
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
