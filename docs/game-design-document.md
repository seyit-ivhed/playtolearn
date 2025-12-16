# Game Design Document: Math Quest Adventures

## Executive Summary

**Game Title:** Math Quest Adventures (working title)

**Target Audience:** Children ages 6-12

**Platform:** Web Browser (Desktop & Tablet)

**Genre:** Educational Fantasy Adventure / RPG Lite

**Core Concept:** Players embark on an epic **Journey** through magical realms, leading an adventuring party. The Journey is divided into many **Adventures**, each with its own theme, story, and map featuring a linear set of **Encounters**. Some encounters involve battles against monsters, while others present puzzles to solve. Each adventure culminates in a **Boss Fight**. Completing an adventure rewards players with either a new companion or **Companion Growth** (existing companions learn new skills and gain experience). The party grows from a small band to a formidable fellowship of heroes.

---

### 1. Game Overview

### 1.1 Vision Statement
Math Quest Adventures transforms math learning into an exciting fantasy **Journey** where every challenge overcome makes your party stronger. Players lead their own fellowship through multiple **Adventures**, each containing a series of **Encounters** (battles and puzzles) that culminate in epic **Boss Fights**. Companions solve contextual math challenges to achieve **Companion Growth**, defeat monsters, and unlock new regions of the realm.

### 1.2 Core Gameplay Loop
```mermaid
graph LR
    A[Select Adventure] --> B[Face Encounters]
    B --> C[Solve Math Challenges]
    C --> D[Defeat Boss Fight]
    D --> E[Companion Growth]
    E --> F[Choose Party of 4]
    F --> G[Next Adventure]
    G --> A
```

### 1.3 Key Features
- **Epic Journey**: Progress through multiple themed adventures, each with unique stories and maps
- **Progressive Math Curriculum**: Adaptive difficulty that grows with player skill
- **Companion Collection**: Recruit diverse heroes, each with unique abilities
- **Party Customization**: Choose 4 companions to take on each adventure
- **Companion Growth System**: Companions learn new skills and gain experience - no equipment micromanagement
- **Linear Adventure Maps**: Each adventure features a sequence of encounters leading to a boss fight
- **Encounter Variety**: Face monster battles and solve puzzles (future feature)
- **Boss Fights**: Epic climactic battles at the end of each adventure
- **Reward System**: Immediate feedback and tangible progression through companion growth

---

## 2. Game Mechanics

### 2.1 Journey & Adventure System

#### Journey Structure
The player's overall progression is called the **Journey**. The Journey is divided into multiple **Adventures**, each representing a self-contained story arc with its own theme, map, and challenges.

#### Adventure Structure
Each **Adventure** consists of:
- **Theme & Story**: Unique narrative context (e.g., "The Goblin Forest", "Dragon's Lair")
- **Linear Map**: A path of connected nodes representing encounters
- **Encounters**: Individual challenges along the path (battles against monsters, or puzzles to solve)
- **Boss Fight**: The final, climactic encounter that must be defeated to complete the adventure
- **Completion Reward**: Either a new companion joins the party, or an existing companion experiences **Companion Growth**

#### Adventure Types
1. **Training Adventures** (Tutorial)
   - Introduction to basic controls and mechanics
   - Simple math challenges (addition, subtraction)
   - Rewards: First companions, initial companion growth

2. **Exploration Adventures**
   - Discover hidden locations and secrets
   - Varied encounters with different monster types
   - Rewards: Companion unlocks, companion growth

3. **Story Adventures**
   - Narrative-driven adventures with character development
   - Mix of battle encounters and puzzle encounters (future)
   - Rewards: Companion unlocks, companion growth, story progression

4. **Challenge Adventures**
   - High-difficulty adventures for advanced players
   - Powerful boss fights requiring strategy
   - Rewards: Rare companions, significant companion growth

#### Encounter Types
- **Battle Encounters**: Turn-based combat against monsters
- **Puzzle Encounters**: Logic and math puzzles to solve (future feature)
- **Boss Fights**: Epic battles against powerful enemies at the end of each adventure
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

**Dimension 2: Difficulty Level** (determines companion growth level)
- **Level 1**: Small numbers (e.g., single-digit)
- **Level 2**: Medium numbers (e.g., double-digit)
- **Level 3**: Large numbers (e.g., triple-digit or complex operations)
- **Level 4**: Very large numbers or multi-step problems
- **Level 5**: Expert level challenges

Example: Completing "Multiplication - Level 3" adventure unlocks a companion or grants companion growth to Level 3

#### Challenge Presentation
- **Contextual Integration**: Math naturally woven into story scenarios (never explicit "math problems")
  - "The merchant needs 7 potions but only has 3. How many more should we buy?"
  - "There are goblins hiding behind rocks. Count them before they attack!"
  - "We found 24 gold coins. Split them fairly among your 4 companions."
  - "The bridge can hold 50 people. We have 32. How many more allies can cross?"
- **Multiple Choice**: For younger players
- **Free Input**: For older/advanced players  
- **Hints System**: Companion dialogue provides guidance (costs in-game currency)

#### Player-Controlled Difficulty
- Players choose both the math skill and difficulty level for each adventure
- Game encourages players to increase difficulty when they perform well (e.g., "You got 9/10 correct! Ready to try Level 3?")
- Game suggests trying easier difficulty or previous skills if player struggles (e.g., "That was tough! Want to practice Level 2 first?")
- No forced adjustments - player always has final choice
- Progress tracking shows performance by skill and difficulty to help inform choices

### 2.3 Companion System

#### Core Design Philosophy
- **Permanent Companions**: Once unlocked, companions are yours forever
- **No Equipment**: Companions upgrade directly (simpler for children)
- **Party Selection**: Choose which 4 companions to bring on each adventure
- **Diverse Heroes**: Each companion has unique personality, appearance, and role

#### Companion Roles & Abilities

**Warrior Companions** (Offensive - Deal Damage)
- **Fire Knight**: Unlocked by Addition challenges
  - **Single Ability**: Flame Strike - high damage attack
  - Personality: Brave and enthusiastic
  - Visual: Red armor, flaming sword

- **Shadow Archer**: Unlocked by Subtraction challenges
  - **Single Ability**: Shadow Arrow - piercing damage
  - Personality: Calm and precise
  - Visual: Dark green cloak, silver bow

- **Lightning Mage**: Unlocked by Multiplication challenges
  - **Single Ability**: Thunder Bolt - explosive damage
  - Personality: Energetic and curious
  - Visual: Purple robes, crackling staff

- **Frost Ranger**: Unlocked by Division challenges
  - **Single Ability**: Ice Arrow - damage with slow effect
  - Personality: Cool and strategic
  - Visual: Blue outfit, frost-tipped arrows

**Guardian Companions** (Defensive - Protect Party)
- **Crystal Guardian**: Unlocked by Fraction challenges
  - **Single Ability**: Crystal Shield - blocks the next incoming attack
  - Personality: Gentle and protective
  - Visual: Translucent crystal armor, glowing shield

- **Earth Defender**: Unlocked by Decimal challenges
  - **Single Ability**: Stone Barrier - blocks the next incoming attack
  - Personality: Steadfast and reliable
  - Visual: Brown/green stone armor

**Support Companions** (Healing & Utility)
- **Light Healer**: Unlocked by mixed operation challenges
  - **Single Ability**: Healing Light - restores party health
  - Personality: Kind and compassionate
  - Visual: White/gold robes, healing staff

- **Nature Druid**: Unlocked by word problem challenges
  - **Single Ability**: Nature's Blessing - restores health over time
  - Personality: Wise and patient
  - Visual: Green robes, nature-themed staff

#### Companion Growth System
- Companions have **5 growth levels** (Level 1-5)
- **Companion Growth** increases ability strength directly as companions learn and gain experience
  - Level 1 Fire Knight: Flame Strike deals 10 damage
  - Level 3 Fire Knight: Flame Strike deals 25 damage
  - Level 5 Fire Knight: Flame Strike deals 45 damage
- Visual changes as companions grow (better armor, glowing effects, more confident poses)
- Players achieve companion growth by completing adventures with harder math challenges
- Simple, encouraging progression: "Your Fire Knight has grown to Level 3!"

#### Companion Collection
- Start with 2 basic companions (e.g., Fire Knight + Light Healer)
- Unlock new companions through adventures and progression
- Initially can have up to 4 total companions, expand to 8+ as you progress
- Benched companions "rest at the Camp" (not abandoned!)
- Strategic choice: Which 4 to bring for this specific adventure?

### 2.4 Encounter System

#### Encounter Flow
1. **Meeting**: Player meets monster or monster group
2. **Action Phase**: Turn-based encounter begins
3. **Victory/Defeat**: Unlock new content or retry option

#### Encounter Mechanics (Turn-Based)
- **Player Turn**:
  - **Action Phase**: Player chooses one of their 4 companions to act (each companion has their single unique ability).
  - **Energy Cost**: Using a companion's ability consumes 1 energy point and ends the player's turn.
  - **Recharge Mechanic**:
    - If a companion has 0 energy, the player can choose to **Recharge** them.
    - Recharging presents a contextual math challenge.
    - **Solve Correctly**: Companion gains 1 Energy (or full charge) immediately.
    - **Solve Incorrectly**: The recharge Fails. The companion remains at 0 energy. The player **cannot** try again this turn; they must wait until the next turn to attempt recharge again.
    - Example: "The Fire Knight needs to calibrate his aim! Solve 12 - 4."

  - **Special Attack Meter (The "Limit Break")**:
    - A shared "Party Meter" fills up as companions successfully use abilities or defeat enemies.
    - When the meter is **Full**, a "Special Attack" button becomes available.
    - Clicking it triggers a **Helper/Boss Level Math Problem** (slightly harder challenge).
    - **Solve Correctly**: Unleashes a powerful effect (e.g., Heal All, Massive Damage to All Enemies).
    - **Solve Incorrectly**: The attack **Fails** and the **Meter Drains completely** to 0. The player must refill the meter to try again.
    - This creates a high-stakes "moment of truth" rewarding mastery.
  
- **Monster Turn**:
  - Monster attacks based on their stats
  - Shield take the damage value until it's consumed


### 2.5 Progression System

#### Journey Progression Through Realms
```mermaid
graph TD
    A[Realm 1: Training Grounds] --> B[Realm 2: Enchanted Forest]
    B --> C[Realm 3: Frozen Mountains]
    C --> D[Realm 4: Desert Kingdom]
    D --> E[Realm 5: Shadow Lands]
    E --> F[Realm 6: Dragon's Lair]
```

Each realm contains multiple adventures:
- Unique visual theme
- Specific math focus areas
- New monster types
- New companions to unlock through adventure completion
- Final adventure with a boss fight that must be defeated to unlock next realm
- Special badge/achievement for defeating the realm boss

---

## 3. Reward System

### 3.1 Adventure Completion Rewards
- **Companion Unlocks**: Completing an adventure unlocks a new companion who joins your party
  - Example: Complete "The Goblin Forest" adventure → Unlock Fire Knight (Level 1)
- **Companion Growth**: Completing adventures grants existing companions growth (they learn new skills and gain experience)
  - Example: Complete "Dragon's Lair" adventure → Fire Knight experiences growth to Level 3
- **Content Unlocks**: Some adventures unlock new realms or adventure paths
- **Boss Badges**: Defeating boss fights grants special achievement badges

### 3.2 Progression Through Mastery
- Players progress through their Journey by improving their math skills
- Stronger companions come from completing harder adventures
- Companion Growth is achieved through skill-based challenges - no currency or resource grinding
- Defeating boss fights unlocks new adventures and realms with new challenges

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
- **Access**: Global button available from the Canvas and Map.
- **Functionality**:
  - **Team Selection**: Drag-and-drop interface to choose the 4 active companions.
  - **Companion Details**: Click any companion to view their "Card" (Stats, Abilities, Lore).
  - **Growth Visualization**: 
    - XP bars and "Next Level" previews.
    - "Evolution" animations play here when a companion levels up.
  - **Equipment/Skins**: Manage cosmetic skins (e.g., "Winter Fire Knight") unlocked via DLC.

### 4.3 Visual Design Principles
- **Child-Friendly**: Bright colors, clear icons, friendly characters
- **Fantasy Theme**: Castles, forests, magical effects, heroes and monsters
- **Feedback**: Animations for success/failure, level-ups
- **Accessibility**: Adjustable text size, colorblind modes
- **Character-Driven**: Companions have personality through dialogue and expressions

---

## 5. Educational Design

### 5.1 Math Curriculum Mapping

#### Grade 1-2 (Ages 6-7)
- Counting to 100
- Single-digit addition and subtraction
- Number recognition and ordering
- Basic shapes and patterns

#### Grade 3-4 (Ages 8-9)
- Multi-digit addition and subtraction
- Multiplication tables (1-12)
- Basic division
- Fractions (halves, quarters)
- Simple word problems

#### Grade 5-6 (Ages 10-11)
- Multi-digit multiplication and division
- Decimals and percentages
- Fraction operations
- Basic algebra (solving for x)
- Geometry (area, perimeter)

#### Grade 7+ (Ages 12+)
- Advanced algebra
- Ratios and proportions
- Negative numbers
- Order of operations
- Pre-algebra concepts

### 5.2 Learning Principles

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
- **Offline Mode**: Optional offline play with sync when online

### 6.2 Technology Stack
- **Frontend**: HTML5, CSS3, TypeScript
- **Framework**: React with TypeScript
- **State Management**: Zustand (already in use)
- **Routing**: React Router (already in use)
- **Internationalization**: i18next (already in use)
- **Testing**: Vitest for unit tests, Playwright for E2E (already in use)
- **Build Tool**: Vite (already in use)
- **Graphics**: CSS animations and SVG for companions/combat visuals
- **AI Art**: Stable Diffusion or similar for companion portraits and backgrounds

### 6.3 Data Storage
- **User Profile**: Username, current realm
- **Companion Collection**: Unlocked companions and their levels
- **Progress**: Completed adventures, unlocked realms, earned badges
- **Statistics**: Problems solved by math skill and difficulty, accuracy rates
- **Settings**: Audio, visual preferences

### 6.4 Art Asset Requirements (AI-Generated)
- **Companion Portraits**: 8-12 unique character portraits (multiple levels each)
- **Enemy Designs**: 6-10 enemy/monster designs
- **Background Scenes**: 6 realm backgrounds (forest, mountains, desert, etc.)
- **UI Elements**: Buttons, frames, decorative elements
- **Ability Effects**: Visual effects for attacks, shields, healing

---

## 7. Business Model & Meta Game

### 7.1 "The Chronicles of Realms" (Freemium + DLC)
- **Core Philosophy**: Honest, high-value content purchases. No ads, no predatory microtransactions for consumables.
- **Base Game (Free)**:
    - Includes "The Training Grounds" and "Realm 1: The Whispering Woods".
    - Full access to "The Magical Canvas" with a starter sticker set.
    - Full access to core math curriculum (Grades 1-2).
- **Realm Packs (Paid DLC)**:
    - **Content**: Unlocks a new Realm (e.g., "The Steam Canyons", "The Crystal Peaks").
    - **Value**: ~10-15 new Adventures, 2 new Unique Companions, new Monsters, and new Math Mechanics.
    - **Bonus**: Exclusive themed Sticker Sets for the Magical Canvas.

### 7.2 Engagement Loops
- **Short Term**: Complete an Adventure -> Earn "Starlight Shards" & Find Hidden Stickers -> Create a new scene in the Canvas.
- **Mid Term**: Level up Companions -> Unlock "Memory Fragments" (Story Comics) -> Deepen connection to characters.
- **Long Term**: Complete a Realm -> Defeat Realm Boss -> Unlock next Realm option -> Collect "Boss Trophy" Sticker.

### 7.3 Content Strategy
- **AI-Assisted Production**: Leveraging AI to generate "filler" content (flavor text, math variations, basic balance curves) allows for a steady stream of content from a small team.
- **Human-Crafted Quality**: Key art, boss mechanics, and companion personalities are hand-crafted to ensure soul and quality.