---
trigger: always_on
---

Don't use any types. It's causing problems on lint check

Avoid using casts to unknown and then casting back again For example the following should not happen:

newParty = CombatEngine.tickStatusEffects(newParty as unknown as BattleUnit[]) as unknown as EncounterUnit[];

Instead let's look for better options for defining, extending and inheriting types
