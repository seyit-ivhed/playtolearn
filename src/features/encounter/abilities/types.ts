import type { BattleUnit } from '../../../types/encounter.types';

export interface AbilityContext {
    attacker: BattleUnit;
    allUnits: BattleUnit[];
    variables: Record<string, number>;
}

export interface AbilityResult {
    updatedUnits: BattleUnit[];
}

export type AbilityImplementation = (context: AbilityContext) => AbilityResult;
