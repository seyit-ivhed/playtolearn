import { type AbilityContext, type AbilityImplementation, type AbilityResult } from './types';
import * as library from './library';

export const AbilityRegistry: Record<string, AbilityImplementation> = {
    // Amara
    'jaguar_strike': library.jaguar_strike,
    'jaguar_strike_2': library.jaguar_strike,
    'jaguar_strike_3': library.jaguar_strike,
    'jaguar_strike_4': library.jaguar_strike,

    // Tariq
    'elixir_of_life': library.elixir_of_life,
    'elixir_of_life_2': library.elixir_of_life,
    'elixir_of_life_3': library.elixir_of_life,
    'elixir_of_life_4': library.elixir_of_life,

    // Kenji
    'blade_barrier': library.blade_barrier,
    'blade_barrier_2': library.blade_barrier,
    'blade_barrier_3': library.blade_barrier,
    'blade_barrier_4': library.blade_barrier,

    // Zahara
    'ancestral_storm': library.ancestral_storm,
    'ancestral_storm_2': library.ancestral_storm,
    'ancestral_storm_3': library.ancestral_storm,
    'ancestral_storm_4': library.ancestral_storm,
};

export function executeAbility(id: string, context: AbilityContext): AbilityResult {
    const implementation = AbilityRegistry[id];
    if (!implementation) {
        console.error(`Ability implementation not found for ID: ${id}`);
        return { updatedUnits: context.allUnits };
    }
    return implementation(context);
}
