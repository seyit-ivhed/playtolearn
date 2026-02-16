import { type AbilityContext, type AbilityImplementation, type AbilityResult } from './types';
import * as library from './library';

export const AbilityRegistry: Record<string, AbilityImplementation> = {
    // Amara
    'precision_shot': library.precision_shot,

    // Tariq
    'elixir_of_life': library.elixir_of_life,

    // Kenji
    'blade_barrier': library.blade_barrier,

    // Zahara
    'ancestral_storm': library.ancestral_storm,
};

export function executeAbility(id: string, context: AbilityContext): AbilityResult {
    const implementation = AbilityRegistry[id];
    if (!implementation) {
        console.error(`Ability implementation not found for ID: ${id}`);
        return { updatedUnits: context.allUnits };
    }
    return implementation(context);
}
