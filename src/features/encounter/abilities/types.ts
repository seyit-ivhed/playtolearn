import type { BattleUnit, CombatLog } from '../../../types/encounter.types';

export interface AbilityContext {
    attacker: BattleUnit;
    allUnits: BattleUnit[];
    variables: Record<string, number>;
}

export interface AbilityResult {
    updatedUnits: BattleUnit[];
    logs: CombatLog[];
}

export type AbilityImplementation = (context: AbilityContext) => AbilityResult;
