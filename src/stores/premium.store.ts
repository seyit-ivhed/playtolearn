import { create } from 'zustand';
import { supabase } from '../services/supabase.service';

export interface PremiumState {
    entitlements: string[];
    isLoading: boolean;
    initialized: boolean;

    // Actions
    initialize: (force?: boolean, profile?: { id: string }) => Promise<void>;
    isAdventureUnlocked: (adventureId: string) => boolean;
    hasEntitlement: (contentPackId: string) => boolean;
}

/**
 * Store to manage premium content ownership.
 * This is not persisted locally to ensure ownership is always server-verified.
 */
export const usePremiumStore = create<PremiumState>((set, get) => ({
    entitlements: [],
    isLoading: false,
    initialized: false,

    initialize: async (force = false, profileData?: { id: string }) => {
        if (get().initialized && !force) return;

        console.log('Initializing premium store (force:', force, ')');
        set({ isLoading: true });
        try {
            let playerId: string | undefined = profileData?.id;

            if (!playerId) {
                const { data: { user } } = await supabase.auth.getUser();
                console.log('Premium store: Current Auth User ID:', user?.id);

                if (!user) {
                    console.warn('Premium store: No user found in Auth');
                    set({ entitlements: [], isLoading: false, initialized: true });
                    return;
                }

                // Player ID IS the Auth ID now
                playerId = user.id;
            }

            if (playerId) {
                console.log('Premium store: Initializing for profile', playerId);
                // Fetch entitlements from the player_entitlements table
                const { data: entitlementsData, error: entitlementsError } = await supabase
                    .from('player_entitlements')
                    .select('content_pack_id')
                    .eq('player_id', playerId);

                if (entitlementsError) {
                    console.error('Error fetching entitlements:', entitlementsError);
                    throw entitlementsError;
                }

                const entitlements = entitlementsData?.map(e => e.content_pack_id) || [];
                console.log('Premium store: Fetched entitlements:', entitlements);

                set({
                    entitlements,
                    isLoading: false,
                    initialized: true
                });
            } else {
                set({ isLoading: false, initialized: true });
            }
        } finally {
            set({ isLoading: false });
        }
    },

    isAdventureUnlocked: (adventureId: string) => {
        const { entitlements } = get();

        // Prologue and Adventure 1 are free
        if (adventureId === 'prologue' || adventureId === '1') return true;

        // Check for 'premium_base' pack which covers Adventures 2-6 in the MVP
        if (entitlements.includes('premium_base')) {
            const idNum = parseInt(adventureId);
            // All initial premium content is unlocked by the base pack
            if (idNum >= 2 && idNum <= 6) return true;
        }

        // Future DLCs would be checked here:
        // if (adventureId === '7' && entitlements.includes('dlc_realm_4')) return true;

        return false;
    },

    hasEntitlement: (contentPackId: string) => {
        const { entitlements } = get();
        return entitlements.includes(contentPackId);
    }
}));
