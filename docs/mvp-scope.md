# MVP Scope: Play to Learn

**Goal:** Validate the "Fun Learning" hypothesis and "Willingness to Pay" for educational content.

## 1. Core Features (The "Must Haves")

To create a playable loop that delivers on the promise of an RPG Math Adventure.

### Gameplay
- **Turn-Based Encounter System**:
    - **Player Party**: 4 slots available in UI (Player starts with 2, ends Free Tier with 3, gets 4th in Paid Tier).
    - Actions: Attack, Heal/Shield.
    - Spirit/Ultimate System: Activating ultimates triggers Math Challenges.
    - **No Timers**: Puzzles and Math challenges are untimed.
- **Math Challenge Engine**:
    - Operations: Add, Subtract, Multiply, **Division, Division with Remainder**.
    - **Difficulty**: Levels 1-5 (User selects difficulty based on child's skill level).
- **Adventure Map**:
    - **Structure**: Linear path of **9 Encounters** + **1 Boss Fight** per Adventure.
    - **Camps**: Interaction points after Encounter #3, #6, and #9.
    - **Encounter Variety**: Mix of Battle Encounters and Untimed Puzzle Encounters.
- **Companion Growth**:
    - XP gain and Leveling up.
    - **Evolution**: Companions change form/stats after max level (Paid Tier feature).
- **The Magical Canvas (Creative Mode)**:
    - **Free-Form Sticker Book**: Simple drag-and-drop interface.

### Systems & UI
- **Party Management**:
    - Select active companions.
    - **XP Distribution**: Manage XP pool and Level Up companions directly from the roster screen.
- **Save System**:
    - **Cloud Persistence**: Essential for ownership.
- **Analytics**:
    - **Retention**: First Play Duration, Second Day Retention.
    - **Funnel**: Drop-off tracking at exact Encounter #.
    - **Commercial**: Store Clicks.

## 2. Content Scope

### Progression System: Level Cap & Evolution

- **Free Tier Cap**: Companions are capped at **Level 10**.
- **Premium Cap Increase**: Each Realm Pack purchased increases the cap by **+10 levels**.
    - 1 Pack → Cap 20
    - 2 Packs (Bundle) → Cap 30
- **Evolution Milestones**: Companions evolve at levels **10, 20, 30, 40, 50** (5 evolutions total).
    - Free Tier: **First evolution** (Evolution 1) is possible at Level 10.
    - 1 Pack: 2nd evolution unlockable (can reach Lv 20).
    - 2 Packs: 3rd evolution unlockable (can reach Lv 30).

- **Future Packs**: Additional realm packs can raise the cap further to unlock evolutions 3-5.

---

### Free Tier (The Hook)
**Realm: The World of Origins**

- **Companions (2)**:
    - *Amara* (South American-inspired Ranger) - Starter
    - *Tariq* (Middle-Eastern-inspired Alchemist) - Starter
- **Adventures (3)**:
    - **1. The Lost Temple (Tutorial)**:
        - Theme: South American Jungle/Ruins (Amara's Home).
        - Short scripted flow to teach core mechanics.
    - **2. The Hidden Oasis**:
        - Theme: Middle-Eastern Desert/City (Tariq's Home).
        - Length: 9 Encounters + 1 Boss.
    - **3. Amara's Expedition**:
        - Theme: Deeper South American Jungle ruins.
        - Length: 9 Encounters + 1 Boss.
- **Monsters**:
    - Jungle: Jaguars, Snakes, Stone Guardians.
    - Desert: Scorpions, Sand Spirits, Bandits.

---

### Paid Tier (The Value Test)

#### Realm Pack: The Baobab Plains (African Theme)
- **New Companion**: *Zahara* (African-inspired Mage)
- **Adventures (4)**:
    - Theme: African Savannah, Ancient Kingdoms.
    - Structure: 9 Encounters + 1 Boss each.
- **New Monsters**: Lions, Hyenas, Nature Spirits, Ancient Guardians.
- **Magical Canvas Pack**: African theme stickers/backgrounds.

#### Realm Pack: The Sakura Highlands (Japanese Theme)
- **New Companion**: *Kenji* (Japanese-inspired Samurai)
- **Adventures (4)**:
    - Theme: Cherry Blossom Forests, Misty Mountains.
    - Structure: 9 Encounters + 1 Boss each.
- **New Monsters**: Oni, Kappa, Tengu, Kitsune Boss.
- **Magical Canvas Pack**: Japanese theme stickers/backgrounds.

#### Bundle: Both Realms
- Discounted price for purchasing both The Baobab Plains and The Sakura Highlands together.
- Complete party of 4 companions (Amara, Tariq, Zahara, Kenji).

## 3. Development Priorities

1.  **Content Pipeline & Free Tier Content** (Top Priority):
    -   Implement "9+1 Encounters" structure.
    -   Create data for Amara, Tariq and their themed monsters.
    -   Tutorial adventure (short scripted flow).
2.  **Progression System**: Level cap and realm-based unlocks.
3.  **Encounter & Puzzle Loop**: Polishing gameplay.
4.  **Canvas**: Basic drag-and-drop.
5.  **Backend & Analytics**: Cloud save setup.
6.  **Premium Content (Post-MVP)**: Baobab Plains and Sakura Highlands realm packs.

