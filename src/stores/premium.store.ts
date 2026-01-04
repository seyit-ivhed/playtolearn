import { create } from 'zustand';
import { supabase } from '../services/supabase.service';

export interface PremiumState {
    entitlements: string[];
    userRole: string;
    isLoading: boolean;
    initialized: boolean;

    // Actions
    initialize: (force?: boolean) => Promise<void>;
    isAdventureUnlocked: (adventureId: string) => boolean;
    hasEntitlement: (contentPackId: string) => boolean;
}

/**
 * Store to manage premium content ownership and player roles.
 * This is not persisted locally to ensure ownership is always server-verified.
 */
export const usePremiumStore = create<PremiumState>((set, get) => ({
    entitlements: [],
    userRole: 'player',
    isLoading: false,
    initialized: false,

    initialize: async (force = false) => {
        if (get().initialized && !force) return;

        console.log('Initializing premium store (force:', force, ')');
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Premium store: Current Auth User ID:', user?.id);

            if (!user) {
                console.warn('Premium store: No user found in Auth');
                set({ entitlements: [], userRole: 'player', isLoading: false, initialized: true });
                return;
            }

            // Fetch profile for role
            const { data: profile, error: profileError } = await supabase
                .from('player_profiles')
                .select('id, role')
                .eq('auth_id', user.id)
                .single();

            if (profileError) {
                console.error('Premium store: Profile fetch error:', profileError);
            }

            if (profile) {
                console.log('Premium store: Found profile', profile.id, 'Role:', profile.role);
                // Fetch entitlements from the player_entitlements table
                const { data: entitlementsData, error: entitlementsError } = await supabase
                    .from('player_entitlements')
                    .select('content_pack_id')
                    .eq('player_id', profile.id);

                if (entitlementsError) {
                    console.error('Error fetching entitlements:', entitlementsError);
                }

                const entitlements = entitlementsData?.map(e => e.content_pack_id) || [];
                console.log('Premium store: Fetched entitlements:', entitlements);

                set({
                    userRole: profile.role || 'player',
                    entitlements,
                    isLoading: false,
                    initialized: true
                });
            } else {
                set({ isLoading: false, initialized: true });
            }
        } catch (error) {
            console.error('Error initializing premium store:', error);
            set({ isLoading: false, initialized: true });
        }
    },

    isAdventureUnlocked: (adventureId: string) => {
        const { entitlements, userRole } = get();

        // Adventure 1 is the free trial
        if (adventureId === '1') return true;

        // Internal roles (Tester/Admin) bypass all content gates
        if (userRole === 'tester' || userRole === 'admin') return true;

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
        const { entitlements, userRole } = get();
        if (userRole === 'tester' || userRole === 'admin') return true;
        return entitlements.includes(contentPackId);
    }
}));
