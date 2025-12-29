# Game Design Document: Math Quest Adventures

## Executive Summary

**Game Title:** Math Quest Adventures (working title)

**Target Audience:** Children ages 6-10

**Platform:** Web Browser (Desktop & Tablet)

**Genre:** Educational Fantasy Adventure / RPG Lite

**Core Concept:** Players embark on an epic **Journey** through magical realms, leading an adventuring party. The Journey is divided into many **Adventures**, each with its own theme, story, and map featuring a linear set of **Encounters**. Some encounters involve battles against monsters, while others present puzzles to solve. Each adventure culminates in a **Boss Fight**. Through the adventures players can unlock new companions, grow and evolve their existing companions and collect visual elements to create their own unique Magical Canvas. The party grows from a small band to a formidable fellowship of heroes.

---

### 1. Game Overview

### 1.1 Vision Statement
Math Quest Adventures transforms math practicing into an exciting fantasy **Journey** where every challenge overcome makes your party stronger. Players lead their own fellowship through multiple **Adventures**, each containing a series of **Encounters** (battles and puzzles) that culminate in epic **Boss Fights**. Companions solve contextual math challenges to achieve **Companion Growth**, defeat monsters, and unlock new regions of the realm.

### 1.2 Core Gameplay Loop
* Choose Adventure/Chapter
* Choose Party from fellowship
* Face Encounters
* Solve Math Challenges
* Grow Companions
* Defeat Boss Fight
* Unlock next adventure

### 1.3 Key Features
- **Epic Journey**: Progress through multiple themed adventures, each with unique stories and maps
- **Selectable Math Curriculum**: Players can select which math curriculum to practice
- **Companion Collection**: Recruit diverse heroes, each with unique abilities
- **Party Customization**: Choose 4 companions to take on each encounter
- **Companion Growth System**: Companions learn upgrade their unique skills as they gain experience
- **Linear Adventure Maps**: Each adventure features a sequence of encounters leading to a boss fight
- **Encounter Variety**: Face monster battles and solve puzzles
- **Boss Fights**: Epic climactic battles at the end of each adventure
- **Reward System**: Immediate feedback and tangible progression through companion growth

---

## 2. Game Mechanics

### 2.1 Journey & Adventure System

#### Journey Structure
The player's overall progression is called the **Journey**. The Journey is divided into multiple **Adventures**, each representing a self-contained story arc with its own theme, map, and challenges. Additional **Journey**s can be purchased as DLCs. Progressing through new journeys unlocks new companions, and styling options for Magical Canvas

#### Adventure Structure
Each **Adventure** consists of:
- **Theme & Story**: Unique narrative context (e.g., "The Goblin Forest", "Dragon's Lair")
- **Linear Map**: A path of connected nodes representing encounters
- **Encounters**: Individual challenges along the path (battles against monsters or puzzles to solve)
- **Boss Fight**: The final, climactic encounter that must be defeated to complete the adventure
- **Completion Reward**: A new companion can join the party or new styling options for Magical Canvas becomes available

#### Encounter Types
- **Battle Encounters**: Turn-based battle against monsters
- **Puzzle Encounters**: Logic and math puzzles to solve (future feature)
- **Boss Fights**: Epic battle against powerful enemies at the end of each adventure
- **Camp Encounters**: Rest stops where players can adjust their party

### 2.2 Math Challenge System

#### Two-Dimensional Difficulty System

**Dimension 1: Math Skill** (determines which companion skill is enhanced)
- Addition
- Subtraction
- Multiplication
- Division
- Fractions
- Decimals
- Algebra basics
- Geometry basics

**Dimension 2: Difficulty Level** (determines companion growth level)
- **Level 1**: Small numbers (e.g., single-digit)
- **Level 2**: Medium numbers (e.g., double-digit)
- **Level 3**: Large numbers (e.g., triple-digit or complex operations)
- **Level 4**: Very large numbers or multi-step problems
- **Level 5**: Expert level challenges

#### Challenge Presentation
- **Contextual Integration**: Math naturally woven into story scenarios or displayed as part of ultimate ability system
  - "The merchant needs 7 potions but only has 3. How many more should we buy?"
  - "There are goblins hiding behind rocks. Count them before they attack!"
  - "We found 24 gold coins. Split them fairly among your 4 companions."
  - "The bridge can hold 50 people. We have 32. How many more allies can cross?"
- **Multiple Choice**: For younger players
- **Free Input**: For older/advanced players  

#### Player-Controlled Difficulty
- Players choose both the math skill and difficulty level for each adventure
- Game encourages players to increase difficulty when they perform well using a star system
- No forced adjustments - player always has final choice
- Progress tracking shows performance by skill and difficulty to help inform choices

### 2.3 Companion System

#### Core Design Philosophy
- **Permanent Companions**: Once unlocked, companions are yours forever
- **No Equipment**: Companions upgrade directly (simpler for children)
- **Party Selection**: Choose which 4 companions to bring on each encounter
- **Diverse Heroes**: Each companion has unique personality, appearance, and abilities

### 2.4 Encounter System

#### Encounter Flow
1. **Meeting**: Player meets monster or monster group
2. **Action Phase**: Turn-based encounter begins
3. **Victory/Defeat**: Unlock new content or retry option

#### Encounter Mechanics (Turn-Based)
- **Player Turn**:
  - **Action Phase**: The player commands their party members. Each companion must act once per turn.
  - **Standard Abilities**: Companions use their attack to do damage to the monster
  - **Completion**: The Player Turn ends automatically when all conscious companions have acted.

- **Ultimate Ability System**:
  - **Spirit Accumulation**: Companions passively generate **Spirit** at the start of every Player Turn.
  - **Ultimate Ready**: When a companion reaches **100 Spirit**, their Standard Ability is replaced by their unique **Ultimate Ability**.
  - **High-Stakes Math Challenge**: Activating an Ultimate triggers a math problem.
    - **Solve Correctly**: The Ultimate activates with a powerful effect (e.g., "Protective Stance", "Piercing Shot").
    - **Solve Incorrectly**: The ability **Fails**, consuming the Spirit and the turn without effect.
    - **Reset**: Spirit always resets to 0 after an Ultimate attempt.

- **Monster Turn**:
  - **Sequential Attacks**: Monsters attack one by one to a random companion.
  - **Shield Mechanics**: Shields provide a temporary health pool that absorbs damage before HP is touched.


### 2.5 Progression System

#### Journey Progression Through Realms
Each realm contains multiple adventures:
- Unique visual theme
- Specific math focus areas
- New monster types
- New companions to unlock through adventure completion
- Final adventure with a boss fight that must be defeated to unlock next realm

---

## 3. Reward System

### 3.1 Encounter Rewards
- **Encounter XP**: Completing each encounter grants scaling XP rewards based on the encounter's position in the adventure (e.g., $10 \times i$ XP).
- **Companion Unlocks**: Completing an entire adventure unlocks a new companion who joins your party.
  - Example: Complete "The Oasis Quest" adventure → Unlock Tariq (Level 1)
---

## 4. User Interface & Experience

### 4.1 The Magical Canvas (Creative Hub)
- **Concept**: A free-form sticker book/diorama creator where players can express themselves artistically.
- **My Scenes**: Players can create and save multiple scenes (e.g., "My Epic Battle", "Peaceful Forest").
- **Asset Collection**: 
  - **Stickers**: Characters, Monsters, Props, Backgrounds, Effects.
  - **Unlock Method**: Unlocked by playing Adventures, finding "Hidden Stickers" (loot), and leveling up Companions.
- **Creative Tools**:
  - **Free Placement**: Drag, drop, scale, rotate, and layer assets anywhere on the canvas.
  - **No Gameplay Constraints**: Pure artistic expression (e.g., placing a Goblin on a cloud).
- **Party Setup**: Accessed via a dedicated menu button, separating utility from creativity.
- **Adventure Map**: Accessible via the "Portal" icon.

### 4.2 Party Management Interface (The Roster)
- **Access**: Access through Camp encounter sites
- **Functionality**:
  - **Team Selection**: Drag-and-drop interface to choose the 4 active companions.
  - **Companion Details**: Hover any companion to view their "Card" (Stats, Abilities, Lore).
  - **Growth Visualization**: 
    - XP bars and "Next Level" previews.
    - "Evolution" animations play here when a companion levels up.

### 4.3 Visual Design Principles
- **Child-Friendly**: Bright colors, clear icons, friendly characters
- **Fantasy Theme**: Castles, forests, magical effects, heroes and monsters
- **Feedback**: Animations for success/failure, level-ups
- **Accessibility**: Adjustable text size, colorblind modes
- **Character-Driven**: Companions have personality through dialogue and expressions

---

## 5. Educational Design

### 5.1 Learning Principles

**Spaced Repetition**
- Previously mastered concepts appear periodically
- Prevents skill decay
- Builds long-term retention

**Immediate Feedback**
- Correct answers: Positive reinforcement, rewards
- Incorrect answers: Show correct solution, offer retry
- No punishment, only learning opportunities

**Scaffolding**
- New concepts introduced gradually
- Build on previously mastered skills
- Provide support that fades as mastery increases

**Intrinsic Motivation**
- Progress is visible and meaningful
- Rewards are immediately useful
- Emotional connection to companions

---

## 6. Technical Considerations

### 6.1 Platform Requirements
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge (latest versions)
- **Responsive Design**: Desktop (1024px+) and tablet (768px+)
- **Performance**: Smooth 60fps animations
- **Save System**: Cloud-based progress saving (account required)

### 6.2 Technology Stack
- **Frontend**: HTML5, CSS3, TypeScript
- **Framework**: React with TypeScript
- **State Management**: Zustand (already in use)
- **Routing**: React Router (already in use)
- **Internationalization**: i18next (already in use)
- **Testing**: Vitest for unit tests, Playwright for E2E (already in use)
- **Build Tool**: Vite (already in use)
- **Graphics**: CSS animations and SVG for companions/battle visuals
- **AI Art**: Google Nano Banana

### 6.3 Data Storage
- **User Profile**: Username, current realm
- **Companion Collection**: Unlocked companions and their levels
- **Progress**: Completed adventures, unlocked realms, earned badges
- **Statistics**: Problems solved by math skill and difficulty, accuracy rates
- **Settings**: Audio, visual preferences

---

## 7. Business Model & Meta Game

### 7.1 "The Chronicles of Realms" (Free Trial + DLC)
- **Core Philosophy**: Honest, high-value content purchases. No ads, no predatory microtransactions for consumables.
- **Free Trial (The Hook)**:
    - Includes "Realm 1: The World of Origins" - First Adventure: "The Oasis Quest".
    - Full access to "The Magical Canvas" with a starter sticker set.
    - Full access to core math curriculum (Grades 1-2).
- **Expansion Packs (Paid DLCs)**:
    - **Content**: Unlocks subsequent content as separate DLCs (e.g., "The Steam Canyons", "The Crystal Peaks") or as a bundle.
    - **Value**: Each DLC contains several adventures (10-15 encounters each), 2 new Unique Companions, new Monsters, and new Math Mechanics.
    - **Bonus**: Exclusive themed Sticker Sets for the Magical Canvas.

### 7.2 Engagement Loops
- **Short Term**: Complete an Adventure -> Earn "Starlight Shards" & Find Hidden Stickers -> Create a new scene in the Canvas.
- **Mid Term**: Level up Companions -> Unlock "Memory Fragments" (Story Comics) -> Deepen connection to characters.
- **Long Term**: Complete a Realm -> Defeat Realm Boss -> Unlock next Realm option -> Collect "Boss Trophy" Sticker.

### 7.3 Content Strategy
- **AI-Assisted Production**: Leveraging AI to generate "filler" content (flavor text, math variations, basic balance curves) allows for a steady stream of content from a small team.
- **Human-Crafted Quality**: Key art, boss mechanics, and companion personalities are hand-crafted to ensure soul and quality.