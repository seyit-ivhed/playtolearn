type BattleUnit = { id: string, hp: number };
type AbilityResult<T> = { updatedUnits: T[] };
const f = <T extends BattleUnit>(units: T[]): AbilityResult<T> => {
  const updatedUnits = units.map(u => ({ ...u, hp: 10 }));
  return { updatedUnits };
};
