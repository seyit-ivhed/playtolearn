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

### Free Tier (The Hook)
**Realm: The World of Origins** (Themed around the diverse cast)

- **Companions (The Base Party)**:
    - **Starter (2)**:
        - *Amara* (South American-inspired Ranger)
        - *Tariq* (Middle-Eastern-inspired Alchemist)
    - **Unlockable (1)**:
        - *Zahara* (African-inspired Mage) - Unlocks at completion of Adventure 2.
- **Adventures** (Themes matching companion origins):
    - **1. The Lost Temple (Tutorial)**:
        - Theme: South American Jungle/Ruins (Amara's Home).
        - Scripted 10-step flow.
    - **2. The Hidden Oasis**:
        - Theme: Middle-Eastern Desert/City (Tariq's Home).
        - Length: 9 Encounters + 1 Boss.
    - **3. The Baobab Plains**:
        - Theme: African Savannah (Zahara's Home).
        - Length: 9 Encounters + 1 Boss.
- **Monsters**:
    - Jungle: Jaguars, Snakes, Stone Guardians.
    - Desert: Scorpions, Sand Spirits, Bandits.
    - Savannah: Lions, Hyenas, Nature Spirits.

### Paid Tier (The Value Test)
**Realm Pack: The Sakura Highlands (Japanese Theme)**

- **Content**:
    - **5 New Adventures**:
        - Theme: Cherry Blossom Forests, Misty Mountains.
        - Structure: 9 Encounters + 1 Boss.
        - Puzzles: New logic puzzles (untimed).
- **Exclusive Rewards**:
    - **New Companion (1)**:
        - *Kenji* (Japanese-inspired Samurai) - Completes the 4-person party.
    - **Companion Evolution**: Unlocks the ability for Max Level companions to Evolve.
    - **New Monsters**: Oni, Kappa, Tengu, Kitsune Boss.
    - **Magical Canvas Pack**: Japanese theme stickers/backgrounds.

## 3. Development Priorities

1.  **Content Pipeline & Free Tier Content** (Top Priority):
    -   Implement "9+1 Encounters" structure.
    -   Create data for Amara, Tariq, Zahara and their themed monsters.
2.  **Combat & Puzzle Loop**: Polishing gameplay.
3.  **Canvas**: Basic drag-and-drop.
4.  **Backend & Analytics**: Cloud save setup.
