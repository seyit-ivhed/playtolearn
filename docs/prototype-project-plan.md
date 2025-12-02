# Project Plan: Space Math Academy - First Prototype

## 1. Executive Summary
**Goal:** Create a playable "Vertical Slice" of Space Math Academy offering approximately 15-30 minutes of gameplay.
**Focus:** Core gameplay loop (Mission Selection -> Math/Combat -> Reward -> Upgrade).
**Target Audience:** Children ages 6-10 (focusing on Grade 1-4 math skills for the prototype).
**Deliverable:** A web-based prototype playable on desktop and tablet.

---

## 2. Prototype Scope (The "Vertical Slice")

The prototype will implement a simplified version of the full game, focusing on the **Training Zone (Sector 1)**.

### 2.1 Content
*   **Sector:** 1 (Training Zone).
*   **Missions:** 5 Total.
    1.  **Tutorial / Training:** Basic controls + Addition (Unlocks Laser Cannon).
    2.  **Skirmish A:** Subtraction focus (Unlocks Missile Launcher).
    3.  **Skirmish B:** Multiplication focus (Unlocks Plasma Beam).
    4.  **Rescue:** Division focus (Unlocks Energy Shield).
    5.  **Boss Battle:** Mixed operations (Unlocks Sector 2 / "To Be Continued" screen).
*   **Math Skills:** Addition, Subtraction, Multiplication, Division (Basic levels).
*   **Enemies:**
    *   *Training Drone* (Passive/Low HP).
    *   *Space Pirate* (Aggressive/Medium HP).
    *   *Boss Ship* (High HP, Multi-stage).

### 2.2 Core Features
*   **Player Profile:** Simple local storage save (Name, Current Mission).
*   **Ship System:**
    *   1 Player Ship.
    *   4 Slots (Weapon 1, Weapon 2, Shield, Armor).
    *   Simple "Equip/Unequip" interface.
*   **Math Engine:**
    *   Problem generator for 4 basic operations.
    *   Difficulty scaling (Level 1-2 only for prototype).
*   **Combat System:**
    *   Turn-based flow.
    *   Player Turn: Select Action -> Solve Math -> Execute.
    *   Enemy Turn: Auto-attack (blocked by shields if active).
    *   Visual feedback (Health bars, damage numbers, simple animations).

---

## 3. Implementation Phases

### Phase 1: Foundation & Infrastructure ✅ COMPLETED
**Goal:** Set up the project structure and basic navigation.
*   [x] Initialize React + TypeScript + Vite project.
*   [x] Setup CSS modules and design tokens.
*   [x] Implement Routing (Home, Mission Select, Combat, Ship Bay).
*   [x] Create basic State Management (Zustand) for Player Profile and Inventory.
*   [x] **Deliverable:** Clickable skeleton of the app with navigation.

### Phase 2: Math Engine & Core Logic ✅ COMPLETED
**Goal:** Functional math problem generation and validation.

> [!IMPORTANT]
> **Phase 2 is divided into 3 parallel streams for simultaneous development:**
> - **Stream 2A** (Math Engine) and **Stream 2B** (Input Components) can be worked on **independently in parallel**
> - **Stream 2C** (Integration) should start **after** Streams 2A and 2B are complete

---

#### **Stream 2A: Math Engine Core Logic** 🔷
**Dependencies:** None (Pure logic, no UI)  
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `types/math.types.ts`:
    *   [x] Define `MathOperation` enum (ADD, SUBTRACT, MULTIPLY, DIVIDE)
    *   [x] Define `MathProblem` interface (operand1, operand2, operation, correctAnswer, choices?)
    *   [x] Define `DifficultyLevel` type (1-2 for prototype)
*   [x] Implement `utils/math-generator.ts`:
    *   [x] Create `generateProblem(operation, difficulty)` function
    *   [x] Implement addition problem generation (difficulty 1-2)
    *   [x] Implement subtraction problem generation (difficulty 1-2)
    *   [x] Implement multiplication problem generation (difficulty 1-2)
    *   [x] Implement division problem generation (difficulty 1-2)
    *   [x] Create `generateMultipleChoices(correctAnswer)` helper function
    *   [x] Create `validateAnswer(userAnswer, correctAnswer)` function
*   [x] Create `stores/math.store.ts` (optional):
    *   [x] Store current problem state
    *   [x] Store answer validation result
    *   [x] Store feedback state (correct/incorrect/pending)
*   [x] **Deliverable:** Fully functional math generator with unit tests possible

---

#### **Stream 2B: Math Input Components** 🔶
**Dependencies:** None (Can use mock data initially)  
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create component folder structure:
    *   [x] `components/MathInput/` directory
    *   [x] `components/Feedback/` directory
*   [x] Build `components/MathInput/Numpad.tsx`:
    *   [x] Create numpad UI (0-9, backspace, submit buttons)
    *   [x] Implement number entry logic
    *   [x] Handle input validation (numbers only)
    *   [x] Create `Numpad.module.css` with child-friendly styling
*   [x] Build `components/MathInput/MultipleChoice.tsx`:
    *   [x] Create choice button grid (4 options)
    *   [x] Implement selection highlighting
    *   [x] Handle choice selection and submission
    *   [x] Create `MultipleChoice.module.css`
*   [x] Build `components/MathInput/MathInput.tsx`:
    *   [x] Wrapper component that switches between Numpad/MultipleChoice
    *   [x] Accept props: `problem`, `onSubmit`, `inputMode`
    *   [x] Display the math problem clearly
    *   [x] Create `MathInput.module.css`
*   [x] Build `components/Feedback/FeedbackIndicator.tsx`:
    *   [x] Visual feedback for correct answers (green, celebration)
    *   [x] Visual feedback for incorrect answers (red, gentle shake)
    *   [x] Pending/neutral state
    *   [x] Create `FeedbackIndicator.module.css` with animations
*   [x] **Deliverable:** Reusable, tested components with mock problem data

---

#### **Stream 2C: Integration & Math Sandbox Page** 🔴
**Dependencies:** ⚠️ Requires Streams 2A AND 2B to be complete  
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `pages/MathSandboxPage.tsx`:
    *   [x] Import math generator from Stream 2A
    *   [x] Import MathInput component from Stream 2B
    *   [x] Import FeedbackIndicator from Stream 2B
    *   [x] Implement UI controls to select operation and difficulty
    *   [x] Wire up problem generation to input component
    *   [x] Wire up answer submission to validation
    *   [x] Display feedback based on validation result
    *   [x] Add "Next Problem" button to generate new problems
*   [x] Create `pages/MathSandboxPage.module.css`:
    *   [x] Layout for sandbox controls and problem display
    *   [x] Child-friendly styling consistent with design system
*   [x] Add route to `App.tsx`:
    *   [x] Add `/math-sandbox` route
    *   [x] Link from HomePage for testing
*   [x] Polish the experience:
    *   [x] Smooth transitions between problems
    *   [x] Sound effects (optional, can defer to Phase 6)
    *   [x] Keyboard support for numpad
*   [x] **Deliverable:** Working Math Sandbox page demonstrating full Phase 2 functionality

---

**Phase 2 Complete When:**
- [x] All three streams are merged and functional
- [x] You can generate and solve math problems in the sandbox
- [x] Feedback system works correctly for right/wrong answers

### Phase 3: Ship & Inventory System ✅ COMPLETED
**Goal:** Allow players to manage their ship and upgrades.

> **Phase 3 is divided into 3 parallel streams:**
> - **Stream 3A** (Data/State) and **Stream 3B** (UI) are **independent** and can run in parallel.
> - **Stream 3C** (Integration) starts **after** 3A and 3B are complete.

---

#### **Stream 3A: Data Models & State Management** 🔷
**Dependencies:** None (Pure logic)  
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `types/ship.types.ts`:
    *   [x] Define `ModuleType` (WEAPON, SHIELD, SPECIAL, CORE).
    *   [x] Define `ShipModule` interface (stats, cost, requirements).
    *   [x] Define `ShipSlot` interface (allowed types, current module).
    *   [x] Define `ShipLoadout` interface.
*   [x] Create `data/modules.data.ts`:
    *   [x] Define starting modules (Basic Laser, Training Shield).
    *   [x] Define unlockable modules from Phase 1 plan.
*   [x] Create `stores/inventory.store.ts`:
    *   [x] Manage list of owned module IDs.
    *   [x] Actions: `unlockModule`, `hasModule`.
*   [x] Create `stores/ship.store.ts`:
    *   [x] Manage current ship state (health, energy).
    *   [x] Manage current loadout (equipped modules).
    *   [x] Actions: `equipModule`, `unequipModule`.
    *   [x] Computed: `totalStats` (sum of base ship + modules).
*   [x] **Deliverable:** Fully typed data layer and state management with tests.

---

#### **Stream 3B: Ship Bay UI Components** 🔶
**Dependencies:** None (Use mock interfaces)  
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `components/Ship/` directory.
*   [x] Build `components/Ship/ModuleCard.tsx`:
    *   [x] Display module icon, name, stats.
    *   [x] Visual states: Equipped, Owned, Locked.
    *   [x] Action buttons (Equip/Unequip).
*   [x] Build `components/Ship/SlotView.tsx`:
    *   [x] Visual representation of a ship slot.
    *   [x] Empty state vs Filled state.
    *   [x] Highlight valid drop targets (if drag-drop) or selection.
*   [x] Build `components/Ship/ShipStatsDisplay.tsx`:
    *   [x] Show total Health, Attack, Defense, Speed.
    *   [x] Visual bars or numbers.
*   [x] Build `components/Ship/LoadoutManager.tsx`:
    *   [x] Layout showing Ship (slots) vs Inventory (available modules).
    *   [x] Responsive design for tablet/desktop.
*   [x] **Deliverable:** Visual components for the Ship Bay.

---

#### **Stream 3C: Integration & Ship Bay Page** 🔴
**Dependencies:** ⚠️ Requires Streams 3A AND 3B  
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Update `pages/ShipBayPage.tsx`:
    *   [x] Connect `ShipStore` and `InventoryStore` (Stream 3A).
    *   [x] Render `LoadoutManager` (Stream 3B).
    *   [x] Implement interaction logic (Click module -> Equip to valid slot).
    *   [x] Handle validation (e.g., can't equip 2 shields if only 1 shield slot).
    *   [x] Persist loadout to local storage (via Zustand persist).
*   [x] Polish:
    *   [x] Add simple animations for equipping items.
    *   [x] Add "Launch Mission" button (disabled if ship invalid).
*   [x] **Deliverable:** Fully functional Ship Bay where players can customize their loadout.

---

**Phase 3 Complete When:**
- [x] Player can view owned items.
- [x] Player can equip/unequip items to correct slots.
- [x] Ship stats update based on equipped items.
- [x] Loadout is saved between sessions.

### Phase 4: Combat System (The Core Loop) ✅ COMPLETED
**Goal:** Playable turn-based combat.
> [!IMPORTANT]
> **Phase 4 is divided into 3 parallel streams:**
> - **Stream 4A** (Logic) and **Stream 4B** (UI) are **independent** and can run in parallel.
> - **Stream 4C** (Integration) starts **after** 4A and 4B are complete.

---

#### **Stream 4A: Combat Engine & State** 🔷
**Dependencies:** None (Mock ship/enemy data initially)
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `types/combat.types.ts`:
    *   [x] Define `CombatPhase` (PLAYER_INPUT, MATH_CHALLENGE, PLAYER_ACTION, ENEMY_ACTION, VICTORY, DEFEAT).
    *   [x] Define `CombatAction` (ATTACK, DEFEND, REPAIR).
    *   [x] Define `CombatState` interface.
*   [x] Create `stores/combat.store.ts`:
    *   [x] Manage turn order and phases.
    *   [x] Manage Player and Enemy health/energy/shields.
    *   [x] Actions: `startCombat`, `executePlayerAction`, `executeEnemyTurn`.
    *   [x] Logic: Damage calculation (Attack - Defense).
*   [x] Implement Basic AI (`utils/enemy-ai.ts`):
    *   [x] Simple function returning an action (Attack vs Defend) based on health.
*   [x] **Deliverable:** Unit-tested combat state machine and logic.

---

#### **Stream 4B: Combat UI Components** 🔶
**Dependencies:** None (Use mock data)
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `components/Combat/` directory.
*   [x] Build `components/Combat/HealthGauge.tsx`:
    *   [x] Visual health/shield bar with numeric overlay.
    *   [x] Animations for damage taken.
*   [x] Build `components/Combat/CombatActionMenu.tsx`:
    *   [x] Buttons for Attack, Defend, Special.
    *   [x] Tooltips showing energy cost/damage.
    *   [x] Disabled states (e.g., not enough energy).
*   [x] Build `components/Combat/CombatLog.tsx`:
    *   [x] Scrollable text area showing battle events ("Player hit for 10 damage!").
*   [x] Build `components/Combat/EntitySprite.tsx`:
    *   [x] Placeholder visual for Player Ship and Enemy.
    *   [x] Shake/Flash animations on hit.
*   [x] **Deliverable:** Standalone UI components for the combat screen.

---

#### **Stream 4C: Integration & Game Loop** 🔴
**Dependencies:** ⚠️ Requires Streams 4A AND 4B + Phase 2 (Math) + Phase 3 (Ship)
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Update `pages/CombatPage.tsx`:
    *   [x] Initialize `CombatStore` with data from `ShipStore` (Player) and `MissionService` (Enemy).
    *   [x] Render `CombatLayout` with UI components.
*   [x] Integrate Math Engine:
    *   [x] Intercept "Attack" action -> Switch to `MATH_CHALLENGE` phase.
    *   [x] Show `MathInput` modal/overlay.
    *   [x] On correct answer -> Execute Attack (Bonus damage for speed?).
    *   [x] On wrong answer -> Miss turn or reduced damage.
*   [x] Implement Win/Loss flows:
    *   [x] Victory: Show rewards (mocked for now), button to return to Map.
    *   [x] Defeat: Retry button.
*   [x] **Deliverable:** Fully playable combat loop.

### Phase 5: Mission Structure & Progression
**Goal:** Tie combat into a campaign with progression.

> [!IMPORTANT]
> **Phase 5 is divided into 3 parallel streams:**
> - **Stream 5A** (Data/State) and **Stream 5B** (UI) are **independent** and can run in parallel.
> - **Stream 5C** (Integration) starts **after** 5A and 5B are complete.

---

#### **Stream 5A: Mission Data & State** 🔷
**Dependencies:** None (Pure logic)
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `types/mission.types.ts`:
    *   [x] Define `MissionId` and `MissionStatus` (LOCKED, AVAILABLE, COMPLETED).
    *   [x] Define `MissionReward` interface (unlocksModuleId?, xp?, currency?).
    *   [x] Define `Mission` interface (id, title, description, enemyId, difficulty, rewards).
*   [x] Create `data/missions.data.ts`:
    *   [x] Define the 5 prototype missions (Tutorial, Skirmish A, Skirmish B, Rescue, Boss).
    *   [x] Configure specific enemies and rewards for each mission.
*   [x] Create `stores/mission.store.ts`:
    *   [x] Manage status of all missions.
    *   [x] Actions: `completeMission(id)`, `unlockMission(id)`.
    *   [x] Computed: `availableMissions`, `currentSectorProgress`.
*   [x] **Deliverable:** Fully typed mission data and progression logic.

---

#### **Stream 5B: Mission UI Components** 🔶
**Dependencies:** None (Use mock data)
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `components/Mission/` directory.
*   [x] Build `components/Mission/MissionNode.tsx`:
    *   [x] Visual representation of a mission on a map/list.
    *   [x] States: Locked (gray), Available (highlighted), Completed (check/gold).
*   [x] Build `components/Mission/MissionInfoModal.tsx`:
    *   [x] Popup showing mission details (Enemy type, Potential Rewards).
    *   [x] "Start Mission" button.
*   [x] Build `components/Mission/RewardSummary.tsx`:
    *   [x] Post-combat screen showing what was unlocked.
    *   [x] "Return to Base" / "Next Mission" buttons.
*   [x] **Deliverable:** Visual components for mission selection and rewards.

---

#### **Stream 5C: Integration & Campaign Loop** 🔴
**Dependencies:** ⚠️ Requires Streams 5A AND 5B + Phase 4
**Assigned Conversation:** Completed

**Tasks:**
*   [x] Create `pages/MissionSelectPage.tsx`:
    *   [x] Render the list/map of missions using `MissionStore`.
    *   [x] Handle navigation to `CombatPage` with selected mission context.
*   [x] Update `pages/CombatPage.tsx`:
    *   [x] Accept `missionId` as a parameter/prop.
    *   [x] Load specific enemy based on mission data.
*   [x] Implement Post-Combat Flow:
    *   [x] On Victory -> Call `MissionStore.completeMission`.
    *   [x] Show `RewardSummary`.
    *   [x] Update `InventoryStore` if new modules are unlocked.
*   [x] **Deliverable:** Full loop: Select Mission -> Fight -> Win -> Get Reward -> Unlock Next.

---

**Phase 5 Complete When:**
- [x] All three streams are merged and functional
- [x] Players can select missions from the mission select screen
- [x] Mission progression tracks completed missions and unlocks next ones
- [x] Combat loads with mission-specific enemy data
- [x] Rewards are granted after victory (XP, currency, modules)
- [x] Complete gameplay loop: Mission Select → Combat → Rewards → Progression

### Phase 5: ✅ COMPLETED

### Phase 6: Polish & Assets
**Goal:** Make it look and feel like a game.

> [!IMPORTANT]
> **Phase 6 is divided into 2 parallel streams:**
> - **Stream 6A** (Visual Assets) and **Stream 6B** (Audio & Effects) are **independent** and can run in parallel.

---

#### **Stream 6A: Visual Polish & Assets** 🔷
**Dependencies:** None
**Assigned Conversation:** TBD

**Tasks:**
*   [ ] Create/Import Assets:
    *   [ ] Backgrounds for different sectors (Training, Deep Space).
    *   [ ] Ship Sprites (Player Ship, Enemy Drone, Pirate, Boss).
    *   [ ] Weapon Icons (Laser, Missile, Plasma, Shield).
*   [ ] Update Components to use Assets:
    *   [ ] Update `EntitySprite.tsx` to render images instead of placeholders.
    *   [ ] Update `CombatPage.tsx` to show background images.
    *   [ ] Update `ModuleCard.tsx` to show weapon icons.
*   [ ] **Deliverable:** Visually upgraded game with real assets.

---

#### **Stream 6B: Audio & "Juice"** 🔶
**Dependencies:** None
**Assigned Conversation:** TBD

**Tasks:**
*   [ ] Implement Sound System:
    *   [ ] Create `utils/sound-manager.ts` (or store) to handle audio playback.
    *   [ ] Add mute/volume controls to a settings menu or UI overlay.
*   [ ] Add Sound Effects:
    *   [ ] Combat sounds (Laser fire, Explosion, Shield hit).
    *   [ ] UI sounds (Button click, Mission select).
    *   [ ] Math sounds (Correct answer chime, Wrong answer buzzer).
*   [ ] Implement Visual Effects ("Juice"):
    *   [ ] Add screen shake effect on damage.
    *   [ ] Add particle effects for explosions or hits.
    *   [ ] Add floating damage numbers.
*   [ ] **Deliverable:** A game that feels responsive and alive.

---

**Phase 6 Complete When:**
- [ ] The game has proper graphics for ships and backgrounds.
- [ ] Audio feedback is present for key actions.
- [ ] Visual feedback (shake, particles) enhances the combat feel.

---

### Phase 7: Tutorial & Onboarding
**Goal:** Teach new players how to play.

> [!IMPORTANT]
> **Phase 7 focuses on a single stream:**

---

#### **Stream 7A: Tutorial System** 🔴
**Dependencies:** Phase 6 (Polish)
**Assigned Conversation:** TBD

**Tasks:**
*   [ ] Create Tutorial Overlay System:
    *   [ ] Build `components/Tutorial/TutorialOverlay.tsx`.
    *   [ ] Support "Step-by-step" guidance (highlighting UI elements).
*   [ ] Implement Tutorial for Mission 1:
    *   [ ] Script the tutorial steps (Welcome, How to Attack, How to Solve Math).
    *   [ ] Integrate into `CombatPage.tsx` (only for Mission 1).
*   [ ] **Deliverable:** A guided experience for new players.

---

**Phase 7 Complete When:**
- [ ] A new player is guided through the first mission.

---

## 4. Technical Stack (MVP)
*   **Frontend:** React, TypeScript, Vite.
*   **State:** Zustand.
*   **Styling:** CSS Modules / Vanilla CSS.
*   **Storage:** `localStorage` (No backend needed for prototype).
*   **Deployment:** Vercel / Netlify / GitHub Pages.

---

## 5. Success Criteria
*   [ ] A new player can complete the 5 missions in 15-30 minutes.
*   [ ] Math problems are generated correctly for the selected difficulty.
*   [ ] Combat is functional: Player can lose if they answer wrong/take too much damage.
*   [ ] Progression works: Unlocked weapons can be equipped and used in the next fight.
*   [ ] No critical bugs preventing completion of the loop.
