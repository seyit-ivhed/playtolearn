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

#### Evolution Path

| Evo | Title | Ability Upgrade | Effect |
|-------|-------|-----------------|--------|
| 1 | **Jungle Tracker** | **Hunter's Mark** | Deals damage + applies mark. Allies deal **+25% damage** to marked target for 2 rounds. |
| 2 | **Apex Stalker** | **Twin Shadows** | Now marks **two enemies** instead of one. |
| 3 | **Nature's Wrath** | **Spirit Release** | If marked target HP < 20%, **purifies them** (Vanquish). |

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

#### Evolution Path

| Evo | Title | Ability Upgrade | Effect |
|-------|-------|-----------------|--------|
| 1 | **Desert Physician** | **Elixir of Renewal** | Heals all allies + Grants **Regeneration** (Restores HP at start of next 2 turns). |
| 2 | **Master Alchemist** | **Panacea Burst** | Heals all allies + **Cleanses** 1 negative status effect. |
| 3 | **Sage of Sands** | **Philosopher's Brew** | Massive Heal to all allies + **Revives** one fallen companion with 30% HP. |

---

### Zahara — The Savannah Mage (Join Later)

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

### Kenji — The Mountain Samurai (Join Later)

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
