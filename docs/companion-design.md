# Companion Design Document

This document defines the 4 MVP companions for Math Quest Adventures.

## Design Philosophy

- **No Role System** — Each companion has unique abilities tied to their identity
- **Stat Trade-offs** — Companions have meaningful HP/Damage trade-offs
- **Ultimate Variety** — Abilities cover different target types for tactical depth

---

## Companions

### Amara — The Jungle Ranger (Starter)

> *"Swift as the jaguar, silent as the wind."*

**Theme:** South American Jungle/Ruins

| Stat | Value |
|------|-------|
| Max Health | 75 |
| Ability Damage | 10 |
| Initial Spirit | 30 |

**Standard Ability:** Attack (10 damage → single enemy)

**Ultimate — Jaguar Strike:**
- Type: `DAMAGE`
- Target: `SINGLE_ENEMY`
- Value: 25

**Fantasy:** Precision hunter — deals massive single-target damage but is fragile.

---

### Tariq — The Desert Alchemist (Starter)

> *"Every problem has a potion."*

**Theme:** Middle-Eastern Desert/City

| Stat | Value |
|------|-------|
| Max Health | 85 |
| Ability Damage | 6 |
| Initial Spirit | 50 |

**Standard Ability:** Attack (6 damage → single enemy)

**Ultimate — Elixir of Life:**
- Type: `HEAL`
- Target: `ALL_ALLIES`
- Value: 15

**Fantasy:** Protector alchemist — his potions restore the party's health in critical moments.

---

### Zahara — The Savannah Mage (Unlockable - Free Tier)

> *"The spirits of the plains answer my call."*

**Theme:** African Savannah

| Stat | Value |
|------|-------|
| Max Health | 70 |
| Ability Damage | 8 |
| Initial Spirit | 40 |

**Standard Ability:** Attack (8 damage → single enemy)

**Ultimate — Ancestral Storm:**
- Type: `DAMAGE`
- Target: `ALL_ENEMIES`
- Value: 15

**Fantasy:** Area-of-effect powerhouse — clears waves of monsters with ancestral magic.

---

### Kenji — The Mountain Samurai (Paid Tier)

> *"One strike. One truth."*

**Theme:** Japanese Cherry Blossom/Mountains

| Stat | Value |
|------|-------|
| Max Health | 100 |
| Ability Damage | 7 |
| Initial Spirit | 60 |

**Standard Ability:** Attack (7 damage → single enemy)

**Ultimate — Blade Barrier:**
- Type: `SHIELD`
- Target: `ALL_ALLIES`
- Value: 12

**Fantasy:** Immovable defender — protects the entire party with his disciplined stance.

---

## Summary

| Companion | HP | Dmg | Spirit | Ultimate | Type | Target | Value |
|-----------|-----|-----|--------|----------|------|--------|-------|
| Amara | 75 | 10 | 30 | Jaguar Strike | DAMAGE | SINGLE_ENEMY | 25 |
| Tariq | 85 | 6 | 50 | Elixir of Life | HEAL | ALL_ALLIES | 15 |
| Zahara | 70 | 8 | 40 | Ancestral Storm | DAMAGE | ALL_ENEMIES | 15 |
| Kenji | 100 | 7 | 60 | Blade Barrier | SHIELD | ALL_ALLIES | 12 |

---

## Implementation Notes

To implement these companions, the following changes are required:

1. **Add HEAL ability type** to `SpecialAbility` in `src/types/companion.types.ts`
2. **Implement heal.ability.ts** in `src/stores/encounter/actions/special/`
3. **Remove the role system** — Delete `CompanionRole` or make it optional
4. **Replace existing companions** (Garrick, Elara) with Amara and Tariq
5. **Add Zahara and Kenji** as unlockable companions
6. **Generate portrait images** for all 4 companions
