# High-Level Progression Structure (MVP F2P)

This document outlines the progression flow, story, and encounter details for the Free-to-Play (F2P) portion of *Math Quest Adventures*.

## Realm: The World of Origins
**Theme:** A vibrant, mystical world where nature and ancient magic coexist. It is the birthplace of the companions.

---

## Story Arc: The Awakening of Heroes
**From Curiosity to Courage:** 
Amara and Tariq are two curious 8-year-old children who have already joined forces after discovering a strange, fading portal leading to the "Magical Canvas"—the source of all life and color in their world. The Canvas is being drained of its vibrancy by the "Void Shadows." 

As they journey through the Desert and Jungle, their experiences and the math challenges they solve cause them to grow—not just in power, but in age and wisdom. By the end of the MVP adventures, they have moved from "Curious Kids" to "Promising Apprentinces."

---

## Adventure 1: The Oasis Quest (Starting Adventure)
**Theme:** Tariq's Home (The Luminescent Desert)
**Character Focus:** Learning the basics while venturing through the desert.
**Tutorial Learning Objectives (Integrated into Encounter 1):**
1.  **Turn-Based Rhythm:** Understanding the "Player Turn" vs "Monster Turn" sequence.
2.  **Health Management:** Monitoring HP and understanding damage.
3.  **Spirit System:** Passively gaining Spirit and activating the Ultimate.
4.  **The Math Bond:** Solving a math challenge to trigger an Ultimate Ability.

### Encounter Matrix (9+1)
| # | Type | Name | Enemies/Challenge |
|---|---|---|---|
| 1 | Battle | Desert Dust-up | 2x Dune Scorpions (Tutorial) |
| 2 | Battle | Mirages | 2x Sand Spirits |
| 3 | Puzzle | Water Flow | Dynamic Arithmetic (Logic-based) |
| 4 | **Camp** | Oasis Shade | Intro to Party Growth (Level Up) |
| 5 | Battle | Sand Raiders | 3x Scorpions |
| 6 | Puzzle | Weighing Rocks | Subtraction Balance |
| 7 | **Camp** | Night Camp | Story beat: Sharing dreams of growth |
| 8 | Battle | Swarm Attack | 4x Tiny Scorpions (Low HP) |
| 9 | Puzzle | Star Map | Multiplication Pathfinding |
| 10| **BOSS** | **The Sand Colossus** | Large HP pool. Focus on Tariq's Healing. |

---

## Adventure 2: The Jungle Expedition
**Theme:** Deeper Jungle (Ancient Ruins)
**Focus:** Synergy between the two young heroes.

### Encounter Matrix (9+1)
| # | Type | Name | Enemies/Challenge |
|---|---|---|---|
| 1 | Battle | Ancient Gates | 2x Jungle Guardians |
| 2 | Puzzle | Rune Lock | Division Logic |
| 3 | Battle | Vine Tanglers | 2x Vine Creepers |
| 4 | **Camp** | Guardian Statue | Restore HP |
| 5 | Puzzle | Temple Gear | Remainder Calculations |
| 6 | Battle | Predator Hunt | 2x Wild Jaguars |
| 7 | **Camp** | Ruin Watch | XP Pool Distribution Check |
| 8 | Battle | Shadow Lurkers | 3x Void Shades |
| 9 | Puzzle | Heart of Ruins | Multi-step Math (Level 5 Complexity) |
| 10| **BOSS** | **The Void Herald** | Defending the First Pigment. |

---

## Dynamic Puzzle Difficulty
Puzzles adapt to the **Difficulty Level (1-5)** selected by the player:

| Level | Grade / Age | Math Complexity | Example |
|---|---|---|---|
| **1** | Age 6 (G1) | Addition/Subtraction (0-10) | 5 + 3 = ? |
| **2** | Age 7 (G2) | Addition/Subtraction (0-20) | 12 - 7 = ? |
| **3** | Age 8 (G3) | Multiplication/Division (Basic) | 3 x 4 = ? |
| **4** | Age 9 (G4) | Complex Mult/Div (Remainders) | 15 / 4 = ? |
| **5** | Age 10+ (G5) | Multi-step Problems | (2 x 6) + 5 = ? |

---

## Systems & Rules

### XP & Progression
- **XP Scaling:** 
    - XP gain scales linearly with the encounter index $i$: $XP = 10 \times i$.
    - **Encounter 1:** 10 XP
    - **Encounter 2:** 20 XP
    - **Encounter 3:** 30 XP
    - ...
    - **Encounter 10 (Boss):** 100 XP
    - **Encounter 20 (Final Boss):** 200 XP
- **Growth Milestone:** At **Level 10** (Free Tier Cap), companions undergo their **First Evolution**. Players will reach this milestone after completing both adventures (20 encounters).


### Death & Failure

- **Party Wipe:** "Don't give up! Try again?" -> **Instant Retry** from the start of the current encounter with full health.
- **Math Failure:** If an Ultimate Math Challenge is failed, Spirit is lost, and the turn is wasted, but the battle continues.

### Target Selection
- **MVP Simplified:** No manual target selection. Abilities either hit the "Front" enemy, "All" enemies, or the "Lowest HP" ally (for Tariq's heal). This keeps UI clean for younger players.

