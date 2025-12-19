# High-Level Progression Structure (MVP F2P)

This document outlines the progression flow, story, and encounter details for the Free-to-Play (F2P) portion of *Math Quest Adventures*.

## Realm: The World of Origins
**Theme:** A vibrant, mystical world where nature and ancient magic coexist. It is the birthplace of the companions.

---

## Story Arc: The Awakening of Heroes
**From Curiosity to Courage:** 
Amara and Tariq are two curious 8-year-old children living in separate corners of the World of Origins. While playing, they both discover a strange, fading portal leading to the "Magical Canvas"—the source of all life and color in their world. The Canvas is being drained of its vibrancy by the "Void Shadows." 

As they journey through the Jungle and Desert, their experiences and the math challenges they solve cause them to grow—not just in power, but in age and wisdom. By the end of the MVP adventures, they have moved from "Curious Kids" to "Promising Apprentinces."

---

## Adventure 1: The First Step (Tutorial)
**Theme:** Amara's Village Outskirts (Lush Jungle)
**Goal:** Reach the Canvas Portal and learn the basics of being a hero.

### Tutorial Learning Objectives
1.  **Turn-Based Rhythm:** Understanding the "Player Turn" vs "Monster Turn" sequence.
2.  **Health Management:** Monitoring HP and understanding damage.
3.  **Spirit System:** Passively gaining Spirit and activating the Ultimate.
4.  **The Math Bond:** Solving a math challenge to trigger an Ultimate Ability.

### Encounter Flow (Scripted)
1.  **Encounter 1 (Battle):** 1x Tiny Spiderling.
    - *Focus:* Player clicks "Attack." Observe monster sequential turn.
2.  **Encounter 2 (Battle):** 1x Jungle Slime.
    - *Focus:* Health bar visualization. 
3.  **Encounter 3 (Spirit):** 1x Stone Pebble (High HP).
    - *Focus:* Wait for Spirit to reach 100. Activate "Jaguar Strike" (Math Challenge).
    - *Note:* No manual targeting; Amara automatically hits the only enemy.
4.  **Camp (Scripted):** Meeting Tariq at the Portal. They decide to venture together.

---

## Adventure 2: The Oasis Quest
**Theme:** Tariq's Home (The Luminescent Desert)
**Character Focus:** Tariq (Support & Healing)

### Encounter Matrix (9+1)
| # | Type | Name | Enemies/Challenge |
|---|---|---|---|
| 1 | Battle | Desert Dust-up | 2x Dune Scorpions |
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

## Adventure 3: The Jungle Expedition
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
    - Battle Victory: **10 XP**
    - Puzzle Solved: **15 XP** (higher reward to encourage non-combat thinking)
- **Growth Milestone:** At **Level 10** (Free Tier Cap), companions undergo their **First Evolution** (a physical and stat change). This gives players a "taste" of the long-term progression system.

### Death & Failure

- **Party Wipe:** "Don't give up! Try again?" -> **Instant Retry** from the start of the current encounter with full health.
- **Math Failure:** If an Ultimate Math Challenge is failed, Spirit is lost, and the turn is wasted, but the battle continues.

### Target Selection
- **MVP Simplified:** No manual target selection. Abilities either hit the "Front" enemy, "All" enemies, or the "Lowest HP" ally (for Tariq's heal). This keeps UI clean for younger players.

