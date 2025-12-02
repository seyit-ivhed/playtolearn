# Technical Architecture: Space Math Academy

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-26
- **Author**: Seyit Ivhed
- **Status**: Initial Draft
- **Related Documents**: [Game Design Document](file:///Users/seyitivhed/Github/playtolearn/docs/game-design-document.md)

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Data Models](#4-data-models)
5. [Component Architecture](#5-component-architecture)
6. [API Design](#6-api-design)
7. [State Management](#7-state-management)
8. [Security Considerations](#8-security-considerations)
9. [Performance Optimization](#9-performance-optimization)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment Strategy](#11-deployment-strategy)
12. [Development Workflow](#12-development-workflow)

---

## 1. Architecture Overview

### 1.1 System Architecture Pattern

Space Math Academy follows a **modular, component-based architecture** with clear separation of concerns:

```mermaid
graph TB
    subgraph "Client Layer"
        UI[UI Components]
        State[State Management]
        Game[Game Logic]
    end
    
    subgraph "Service Layer"
        Auth[Authentication Service]
        Mission[Mission Service]
        Combat[Combat Service]
        Progress[Progress Service]
    end
    
    subgraph "Data Layer"
        API[REST API]
        DB[(Database)]
        Cache[(Cache)]
    end
    
    UI --> State
    State --> Game
    Game --> Service
    Service --> API
    API --> DB
    API --> Cache
```

### 1.2 Design Principles

#### Single Responsibility Principle
Each module, component, and service has one clear purpose:
- **Mission Service**: Handles mission logic only
- **Combat Service**: Manages combat mechanics only
- **Progress Service**: Tracks player progression only

#### Modularity
- Short, focused files (< 200 lines per file)
- Clear interfaces between modules
- Easy to test in isolation
- Simple to extend with new features

#### Scalability
- Stateless backend services
- Horizontal scaling capability
- Efficient caching strategies
- Optimized database queries

#### Maintainability
- Clear naming conventions
- Comprehensive documentation
- Type safety with TypeScript
- Automated testing

---

## 2. Technology Stack

### 2.1 Frontend Stack

#### Core Technologies
```typescript
{
  "runtime": "Browser (ES2020+)",
  "language": "TypeScript 5.x",
  "framework": "React 18.x",
  "buildTool": "Vite 5.x",
  "styling": "CSS Modules + Vanilla CSS"
}
```

#### Key Libraries
- **State Management**: Zustand (lightweight, simple)
- **Routing**: React Router v6
- **Animation**: Framer Motion (for smooth UI transitions)
- **Icons**: Lucide React (lightweight, tree-shakeable)
- **Forms**: React Hook Form (for settings/auth)
- **HTTP Client**: Fetch API (native, no dependencies)

#### Development Tools
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

### 2.2 Backend Stack

#### Core Technologies
```typescript
{
  "runtime": "Node.js 20.x LTS",
  "language": "TypeScript 5.x",
  "framework": "Express.js 4.x",
  "database": "PostgreSQL 16.x",
  "cache": "Redis 7.x (optional for MVP)"
}
```

#### Key Libraries
- **ORM**: Drizzle ORM (type-safe, lightweight)
- **Validation**: Zod (runtime type validation)
- **Authentication**: Passport.js + JWT
- **Password Hashing**: bcrypt
- **Environment**: dotenv
- **Logging**: Winston

#### Development Tools
- **Testing**: Vitest + Supertest
- **Database Migrations**: Drizzle Kit
- **API Documentation**: OpenAPI/Swagger
- **Process Manager**: PM2 (production)

### 2.3 Infrastructure

#### Development
- **Version Control**: Git + GitHub
- **Package Manager**: npm/pnpm
- **Local Database**: Docker Compose (PostgreSQL)
- **Environment Management**: .env files

#### Production (Future)
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **Database**: Managed PostgreSQL (Neon, Supabase, or Railway)
- **CDN**: Cloudflare
- **Monitoring**: Sentry (error tracking)
- **Analytics**: Plausible (privacy-friendly)

---

## 3. System Architecture

### 3.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client (Browser)"
        UI[React UI Layer]
        Store[Zustand Store]
        GameEngine[Game Logic Engine]
        MathEngine[Math Problem Generator]
    end
    
    subgraph "Backend API"
        Auth[Auth Controller]
        User[User Controller]
        Progress[Progress Controller]
        Mission[Mission Controller]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL)]
        Redis[(Redis Cache)]
    end
    
    UI --> Store
    Store --> GameEngine
    GameEngine --> MathEngine
    
    UI --> Auth
    UI --> User
    UI --> Progress
    UI --> Mission
    
    Auth --> PG
    User --> PG
    Progress --> PG
    Mission --> PG
    
    Progress --> Redis
    Mission --> Redis
```

### 3.2 Frontend Architecture

```mermaid
graph LR
    subgraph "Presentation Layer"
        Pages[Pages/Routes]
        Components[UI Components]
    end
    
    subgraph "Business Logic Layer"
        Services[Service Layer]
        Hooks[Custom Hooks]
    end
    
    subgraph "Data Layer"
        Store[State Store]
        API[API Client]
    end
    
    Pages --> Components
    Components --> Hooks
    Hooks --> Services
    Services --> Store
    Services --> API
```

### 3.3 Backend Architecture

```mermaid
graph LR
    subgraph "API Layer"
        Routes[Express Routes]
        Middleware[Middleware]
    end
    
    subgraph "Business Logic"
        Controllers[Controllers]
        Services[Services]
    end
    
    subgraph "Data Access"
        Repositories[Repositories]
        Models[Database Models]
    end
    
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Models
```

### 3.4 Directory Structure

#### Frontend Structure
```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Card, etc.)
│   ├── combat/         # Combat-specific components
│   ├── mission/        # Mission-specific components
│   └── ship/           # Ship customization components
├── pages/              # Route-level page components
│   ├── HomePage.tsx
│   ├── MissionPage.tsx
│   ├── CombatPage.tsx
│   └── ShipBayPage.tsx
├── services/           # Business logic services
│   ├── auth.service.ts
│   ├── mission.service.ts
│   ├── combat.service.ts
│   └── progress.service.ts
├── stores/             # Zustand state stores
│   ├── auth.store.ts
│   ├── player.store.ts
│   ├── mission.store.ts
│   └── combat.store.ts
├── hooks/              # Custom React hooks
│   ├── useMission.ts
│   ├── useCombat.ts
│   └── useProgress.ts
├── utils/              # Utility functions
│   ├── math-generator.ts
│   ├── validators.ts
│   └── formatters.ts
├── types/              # TypeScript type definitions
│   ├── player.types.ts
│   ├── mission.types.ts
│   ├── combat.types.ts
│   └── module.types.ts
├── config/             # Configuration files
│   └── constants.ts
├── styles/             # Global styles
│   └── global.css
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

#### Backend Structure
```
server/
├── src/
│   ├── controllers/    # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── progress.controller.ts
│   │   └── mission.controller.ts
│   ├── services/       # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── progress.service.ts
│   │   └── mission.service.ts
│   ├── repositories/   # Data access layer
│   │   ├── user.repository.ts
│   │   ├── progress.repository.ts
│   │   └── mission.repository.ts
│   ├── models/         # Database schemas
│   │   ├── user.model.ts
│   │   ├── progress.model.ts
│   │   └── mission.model.ts
│   ├── middleware/     # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/         # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── progress.routes.ts
│   │   └── mission.routes.ts
│   ├── utils/          # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   └── logger.util.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── config/         # Configuration
│   │   └── database.config.ts
│   └── index.ts        # Entry point
├── migrations/         # Database migrations
└── tests/             # Backend tests
```

---

## 4. Data Models

### 4.1 Core Entities

#### User Entity
```typescript
interface User {
  id: string;                    // UUID
  username: string;              // Unique username
  email: string;                 // Unique email
  passwordHash: string;          // Bcrypt hash
  createdAt: Date;
  updatedAt: Date;
}
```

#### Player Profile Entity
```typescript
interface PlayerProfile {
  id: string;                    // UUID
  userId: string;                // Foreign key to User
  displayName: string;           // Player's display name
  currentSectorId: number;       // Current unlocked sector
  totalProblemsCompleted: number;
  totalMissionsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Module Entity
```typescript
interface Module {
  id: string;                    // UUID
  playerId: string;              // Foreign key to PlayerProfile
  moduleType: ModuleType;        // 'weapon' | 'shield' | 'armor'
  moduleCategory: MathSkill;     // 'addition' | 'subtraction' | etc.
  level: number;                 // 1-5
  isEquipped: boolean;
  unlockedAt: Date;
}

type ModuleType = 'weapon' | 'shield' | 'armor';

type MathSkill = 
  | 'addition' 
  | 'subtraction' 
  | 'multiplication' 
  | 'division' 
  | 'fractions' 
  | 'decimals' 
  | 'algebra';
```

#### Mission Progress Entity
```typescript
interface MissionProgress {
  id: string;                    // UUID
  playerId: string;              // Foreign key to PlayerProfile
  missionId: string;             // Mission identifier
  mathSkill: MathSkill;
  difficultyLevel: number;       // 1-5
  isCompleted: boolean;
  problemsAttempted: number;
  problemsCorrect: number;
  accuracy: number;              // Percentage
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Sector Progress Entity
```typescript
interface SectorProgress {
  id: string;                    // UUID
  playerId: string;              // Foreign key to PlayerProfile
  sectorId: number;              // 1-6
  isUnlocked: boolean;
  bossDefeated: boolean;
  unlockedAt: Date | null;
  bossDefeatedAt: Date | null;
}
```

#### Badge Entity
```typescript
interface Badge {
  id: string;                    // UUID
  playerId: string;              // Foreign key to PlayerProfile
  badgeType: BadgeType;
  badgeName: string;
  description: string;
  earnedAt: Date;
}

type BadgeType = 
  | 'boss_defeated' 
  | 'sector_completed' 
  | 'skill_mastery' 
  | 'streak' 
  | 'special';
```

#### Statistics Entity
```typescript
interface PlayerStatistics {
  id: string;                    // UUID
  playerId: string;              // Foreign key to PlayerProfile
  mathSkill: MathSkill;
  difficultyLevel: number;       // 1-5
  problemsAttempted: number;
  problemsCorrect: number;
  accuracy: number;              // Percentage
  lastAttemptedAt: Date;
  updatedAt: Date;
}
```

### 4.2 Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player profiles table
CREATE TABLE player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  current_sector_id INTEGER DEFAULT 1,
  total_problems_completed INTEGER DEFAULT 0,
  total_missions_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  module_type VARCHAR(20) NOT NULL CHECK (module_type IN ('weapon', 'shield', 'armor')),
  module_category VARCHAR(20) NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  is_equipped BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mission progress table
CREATE TABLE mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  mission_id VARCHAR(100) NOT NULL,
  math_skill VARCHAR(20) NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  is_completed BOOLEAN DEFAULT false,
  problems_attempted INTEGER DEFAULT 0,
  problems_correct INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, mission_id)
);

-- Sector progress table
CREATE TABLE sector_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  sector_id INTEGER NOT NULL CHECK (sector_id >= 1 AND sector_id <= 6),
  is_unlocked BOOLEAN DEFAULT false,
  boss_defeated BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP,
  boss_defeated_at TIMESTAMP,
  UNIQUE(player_id, sector_id)
);

-- Badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  badge_type VARCHAR(30) NOT NULL,
  badge_name VARCHAR(100) NOT NULL,
  description TEXT,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player statistics table
CREATE TABLE player_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  math_skill VARCHAR(20) NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  problems_attempted INTEGER DEFAULT 0,
  problems_correct INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  last_attempted_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, math_skill, difficulty_level)
);

-- Indexes for performance
CREATE INDEX idx_modules_player_id ON modules(player_id);
CREATE INDEX idx_modules_equipped ON modules(player_id, is_equipped);
CREATE INDEX idx_mission_progress_player_id ON mission_progress(player_id);
CREATE INDEX idx_mission_progress_completed ON mission_progress(player_id, is_completed);
CREATE INDEX idx_sector_progress_player_id ON sector_progress(player_id);
CREATE INDEX idx_badges_player_id ON badges(player_id);
CREATE INDEX idx_statistics_player_id ON player_statistics(player_id);
```

### 4.3 Frontend State Models

#### Player State
```typescript
interface PlayerState {
  profile: PlayerProfile | null;
  modules: Module[];
  equippedModules: {
    weapons: Module[];
    shields: Module[];
    armor: Module[];
  };
  statistics: PlayerStatistics[];
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadProfile: () => Promise<void>;
  equipModule: (moduleId: string) => Promise<void>;
  unequipModule: (moduleId: string) => Promise<void>;
}
```

#### Mission State
```typescript
interface MissionState {
  currentMission: Mission | null;
  availableMissions: Mission[];
  missionProgress: MissionProgress[];
  currentProblem: MathProblem | null;
  problemIndex: number;
  score: number;
  isLoading: boolean;
  
  // Actions
  startMission: (missionId: string) => void;
  submitAnswer: (answer: number) => void;
  completeMission: () => Promise<void>;
  exitMission: () => void;
}
```

#### Combat State
```typescript
interface CombatState {
  playerShip: Ship;
  enemyShip: Ship;
  currentTurn: 'player' | 'enemy';
  combatLog: CombatLogEntry[];
  currentProblem: MathProblem | null;
  isActive: boolean;
  
  // Actions
  startCombat: (enemyId: string) => void;
  selectWeapon: (weaponId: string) => void;
  submitCombatAnswer: (answer: number) => void;
  endCombat: (result: 'victory' | 'defeat') => void;
}
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```mermaid
graph TD
    App[App]
    
    App --> Layout[Layout]
    
    Layout --> HomePage[HomePage]
    Layout --> MissionPage[MissionPage]
    Layout --> CombatPage[CombatPage]
    Layout --> ShipBayPage[ShipBayPage]
    Layout --> ProfilePage[ProfilePage]
    
    HomePage --> MissionBoard[MissionBoard]
    HomePage --> StarMap[StarMap]
    HomePage --> QuickStats[QuickStats]
    
    MissionPage --> MissionHeader[MissionHeader]
    MissionPage --> ProblemDisplay[ProblemDisplay]
    MissionPage --> AnswerInput[AnswerInput]
    MissionPage --> ProgressBar[ProgressBar]
    
    CombatPage --> CombatArena[CombatArena]
    CombatPage --> ShipDisplay[ShipDisplay]
    CombatPage --> CombatControls[CombatControls]
    CombatPage --> CombatLog[CombatLog]
    
    ShipBayPage --> ShipPreview[ShipPreview]
    ShipBayPage --> ModuleInventory[ModuleInventory]
    ShipBayPage --> ModuleSlots[ModuleSlots]
```

### 5.2 Key Components

#### Mission Components

**MissionBoard.tsx**
```typescript
interface MissionBoardProps {
  onSelectMission: (mission: Mission) => void;
}

// Displays available missions grouped by math skill
// Allows filtering by difficulty level
// Shows mission rewards and requirements
```

**ProblemDisplay.tsx**
```typescript
interface ProblemDisplayProps {
  problem: MathProblem;
  showHint: boolean;
  onRequestHint: () => void;
}

// Displays math problem with context
// Shows visual aids if applicable
// Provides hint system
```

**AnswerInput.tsx**
```typescript
interface AnswerInputProps {
  problemType: 'multiple-choice' | 'free-input';
  options?: number[];
  onSubmit: (answer: number) => void;
  disabled: boolean;
}

// Handles answer input (multiple choice or free input)
// Provides number pad for younger users
// Validates input before submission
```

#### Combat Components

**CombatArena.tsx**
```typescript
interface CombatArenaProps {
  playerShip: Ship;
  enemyShip: Ship;
  onAttack: (weaponId: string) => void;
  onDefend: () => void;
}

// Main combat interface
// Displays both ships with health/shields
// Shows combat animations
```

**ShipDisplay.tsx**
```typescript
interface ShipDisplayProps {
  ship: Ship;
  isPlayer: boolean;
  showModules: boolean;
}

// Visual representation of ship
// Shows health, shields, energy
// Displays equipped modules
```

#### Ship Customization Components

**ModuleInventory.tsx**
```typescript
interface ModuleInventoryProps {
  modules: Module[];
  onSelectModule: (module: Module) => void;
  selectedModule: Module | null;
}

// Displays all unlocked modules
// Grouped by type (weapons, shields, armor)
// Shows module stats and level
```

**ModuleSlots.tsx**
```typescript
interface ModuleSlotsProps {
  equippedModules: Module[];
  onEquip: (moduleId: string, slotIndex: number) => void;
  onUnequip: (slotIndex: number) => void;
}

// Shows available equipment slots
// Drag-and-drop or click to equip
// Visual feedback for equipped modules
```

### 5.3 Component Design Patterns

#### Composition over Inheritance
```typescript
// Good: Composable components
<Card>
  <CardHeader title="Mission Board" />
  <CardContent>
    <MissionList missions={missions} />
  </CardContent>
</Card>

// Avoid: Deep inheritance hierarchies
```

#### Container/Presenter Pattern
```typescript
// Container (handles logic)
const MissionPageContainer = () => {
  const { mission, submitAnswer } = useMission();
  return <MissionPagePresenter mission={mission} onSubmit={submitAnswer} />;
};

// Presenter (handles UI)
const MissionPagePresenter = ({ mission, onSubmit }) => {
  return <div>{/* UI only */}</div>;
};
```

#### Custom Hooks for Logic Reuse
```typescript
// useMission.ts
export const useMission = (missionId: string) => {
  const [mission, setMission] = useState<Mission | null>(null);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  
  const submitAnswer = async (answer: number) => {
    // Logic here
  };
  
  return { mission, currentProblem, submitAnswer };
};
```

---

## 6. API Design

### 6.1 API Architecture

#### RESTful Principles
- Resource-based URLs
- HTTP methods for CRUD operations
- Stateless requests
- JSON request/response format

#### Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.spacemath.academy/v1
```

### 6.2 Authentication Endpoints

```typescript
// POST /api/v1/auth/register
Request: {
  username: string;
  email: string;
  password: string;
}
Response: {
  user: User;
  token: string;
}

// POST /api/v1/auth/login
Request: {
  email: string;
  password: string;
}
Response: {
  user: User;
  token: string;
}

// POST /api/v1/auth/logout
Headers: { Authorization: "Bearer <token>" }
Response: { message: string }

// GET /api/v1/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { user: User }
```

### 6.3 Player Endpoints

```typescript
// GET /api/v1/player/profile
Headers: { Authorization: "Bearer <token>" }
Response: {
  profile: PlayerProfile;
  statistics: PlayerStatistics[];
}

// GET /api/v1/player/modules
Headers: { Authorization: "Bearer <token>" }
Response: {
  modules: Module[];
  equipped: {
    weapons: Module[];
    shields: Module[];
    armor: Module[];
  };
}

// POST /api/v1/player/modules/:moduleId/equip
Headers: { Authorization: "Bearer <token>" }
Response: { module: Module }

// POST /api/v1/player/modules/:moduleId/unequip
Headers: { Authorization: "Bearer <token>" }
Response: { module: Module }

// GET /api/v1/player/badges
Headers: { Authorization: "Bearer <token>" }
Response: { badges: Badge[] }
```

### 6.4 Mission Endpoints

```typescript
// GET /api/v1/missions
Headers: { Authorization: "Bearer <token>" }
Query: {
  sectorId?: number;
  mathSkill?: MathSkill;
  difficultyLevel?: number;
}
Response: { missions: Mission[] }

// GET /api/v1/missions/:missionId
Headers: { Authorization: "Bearer <token>" }
Response: { mission: Mission }

// POST /api/v1/missions/:missionId/start
Headers: { Authorization: "Bearer <token>" }
Response: {
  missionProgress: MissionProgress;
  problems: MathProblem[];
}

// POST /api/v1/missions/:missionId/complete
Headers: { Authorization: "Bearer <token>" }
Request: {
  problemsAttempted: number;
  problemsCorrect: number;
  answers: Answer[];
}
Response: {
  missionProgress: MissionProgress;
  rewards: {
    modules: Module[];
    badges: Badge[];
    unlockedSectors: number[];
  };
}
```

### 6.5 Progress Endpoints

```typescript
// GET /api/v1/progress/sectors
Headers: { Authorization: "Bearer <token>" }
Response: { sectors: SectorProgress[] }

// GET /api/v1/progress/statistics
Headers: { Authorization: "Bearer <token>" }
Query: {
  mathSkill?: MathSkill;
  difficultyLevel?: number;
}
Response: { statistics: PlayerStatistics[] }

// POST /api/v1/progress/sector/:sectorId/unlock
Headers: { Authorization: "Bearer <token>" }
Response: { sectorProgress: SectorProgress }
```

### 6.6 Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable message
    details?: any;          // Additional error details
    timestamp: string;      // ISO 8601 timestamp
  };
}

// Example error codes:
// - AUTH_INVALID_CREDENTIALS
// - AUTH_TOKEN_EXPIRED
// - VALIDATION_FAILED
// - RESOURCE_NOT_FOUND
// - PERMISSION_DENIED
// - SERVER_ERROR
```

---

## 7. State Management

### 7.1 Zustand Store Architecture

#### Store Organization
```typescript
// stores/auth.store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

// stores/player.store.ts
interface PlayerState {
  profile: PlayerProfile | null;
  modules: Module[];
  badges: Badge[];
  statistics: PlayerStatistics[];
  
  loadProfile: () => Promise<void>;
  equipModule: (moduleId: string) => Promise<void>;
  unequipModule: (moduleId: string) => Promise<void>;
}

// stores/mission.store.ts
interface MissionState {
  currentMission: Mission | null;
  problems: MathProblem[];
  currentProblemIndex: number;
  answers: Answer[];
  
  startMission: (missionId: string) => Promise<void>;
  submitAnswer: (answer: number) => void;
  completeMission: () => Promise<void>;
  resetMission: () => void;
}

// stores/combat.store.ts
interface CombatState {
  isActive: boolean;
  playerShip: Ship;
  enemyShip: Ship;
  currentTurn: 'player' | 'enemy';
  combatLog: CombatLogEntry[];
  
  startCombat: (enemyId: string) => void;
  attack: (weaponId: string, answer: number) => void;
  defend: () => void;
  endCombat: () => void;
}
```

### 7.2 State Persistence

#### Local Storage Strategy
```typescript
// Persist auth token
const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      // ... other state
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

// Cache player data
const usePlayerStore = create(
  persist(
    (set) => ({
      profile: null,
      modules: [],
      // ... other state
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        profile: state.profile,
        modules: state.modules,
      }),
    }
  )
);
```

### 7.3 State Synchronization

#### Optimistic Updates
```typescript
// Example: Equip module with optimistic update
const equipModule = async (moduleId: string) => {
  const module = get().modules.find(m => m.id === moduleId);
  if (!module) return;
  
  // Optimistic update
  set(state => ({
    modules: state.modules.map(m =>
      m.id === moduleId ? { ...m, isEquipped: true } : m
    ),
  }));
  
  try {
    // API call
    await api.equipModule(moduleId);
  } catch (error) {
    // Rollback on error
    set(state => ({
      modules: state.modules.map(m =>
        m.id === moduleId ? { ...m, isEquipped: false } : m
      ),
    }));
    throw error;
  }
};
```

---

## 8. Security Considerations

### 8.1 Authentication & Authorization

#### JWT Token Strategy
```typescript
// Token structure
interface JWTPayload {
  userId: string;
  email: string;
  iat: number;        // Issued at
  exp: number;        // Expiration (24 hours)
}

// Token storage
// - Access token: Memory (React state)
// - Refresh token: HttpOnly cookie (future enhancement)
```

#### Password Security
```typescript
// Password requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false,
};

// Hashing with bcrypt
const BCRYPT_ROUNDS = 12;
```

### 8.2 Input Validation

#### Frontend Validation
```typescript
// Zod schemas for validation
const registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});

const answerSchema = z.object({
  problemId: z.string().uuid(),
  answer: z.number().int(),
  timeSpent: z.number().positive(),
});
```

#### Backend Validation
```typescript
// Validate all inputs on backend
// Never trust client-side validation alone
const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Validation failed' });
    }
  };
};
```

### 8.3 API Security

#### Rate Limiting
```typescript
// Prevent abuse with rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Limit each IP to 100 requests per window
  message: 'Too many requests',
});

// Stricter limits for auth endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // 5 login attempts per 15 minutes
});
```

#### CORS Configuration
```typescript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
```

#### SQL Injection Prevention
```typescript
// Use parameterized queries with Drizzle ORM
// Never concatenate user input into SQL
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))  // Safe: parameterized
  .limit(1);
```

### 8.4 Data Privacy

#### GDPR Compliance
- User data deletion on request
- Data export functionality
- Clear privacy policy
- Minimal data collection

#### Child Safety (COPPA)
- Parental consent for users under 13
- No personal information collection from children
- No third-party advertising
- Secure data storage

---

## 9. Performance Optimization

### 9.1 Frontend Optimization

#### Code Splitting
```typescript
// Route-based code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const MissionPage = lazy(() => import('./pages/MissionPage'));
const CombatPage = lazy(() => import('./pages/CombatPage'));

// Component lazy loading
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));
```

#### Memoization
```typescript
// Memoize expensive computations
const MissionBoard = () => {
  const missions = useMissionStore(state => state.missions);
  
  const filteredMissions = useMemo(() => {
    return missions.filter(/* expensive filter */);
  }, [missions]);
  
  return <div>{/* render */}</div>;
};

// Memoize components
const MissionCard = memo(({ mission }) => {
  return <div>{/* render */}</div>;
});
```

#### Virtual Scrolling
```typescript
// For long lists (e.g., module inventory)
import { useVirtualizer } from '@tanstack/react-virtual';

const ModuleInventory = ({ modules }) => {
  const virtualizer = useVirtualizer({
    count: modules.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });
  
  // Render only visible items
};
```

### 9.2 Backend Optimization

#### Database Indexing
```sql
-- Critical indexes for performance
CREATE INDEX idx_modules_player_equipped ON modules(player_id, is_equipped);
CREATE INDEX idx_mission_progress_player_completed ON mission_progress(player_id, is_completed);
CREATE INDEX idx_statistics_player_skill ON player_statistics(player_id, math_skill);
```

#### Query Optimization
```typescript
// Eager loading to prevent N+1 queries
const playerWithModules = await db
  .select()
  .from(players)
  .leftJoin(modules, eq(players.id, modules.playerId))
  .where(eq(players.id, playerId));

// Pagination for large datasets
const missions = await db
  .select()
  .from(missionProgress)
  .where(eq(missionProgress.playerId, playerId))
  .limit(20)
  .offset(page * 20);
```

#### Caching Strategy (Future)
```typescript
// Redis caching for frequently accessed data
const getCachedPlayerProfile = async (playerId: string) => {
  const cached = await redis.get(`player:${playerId}`);
  if (cached) return JSON.parse(cached);
  
  const profile = await db.query.players.findFirst({
    where: eq(players.id, playerId),
  });
  
  await redis.setex(`player:${playerId}`, 3600, JSON.stringify(profile));
  return profile;
};
```

### 9.3 Asset Optimization

#### Image Optimization
- Use WebP format with fallbacks
- Lazy load images below the fold
- Responsive images with srcset
- SVG for icons and illustrations

#### Font Optimization
```css
/* Subset fonts to only needed characters */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-subset.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0020-007F; /* Basic Latin */
}
```

---

## 10. Testing Strategy

### 10.1 Testing Pyramid

```mermaid
graph TB
    E2E[E2E Tests - 10%]
    Integration[Integration Tests - 30%]
    Unit[Unit Tests - 60%]
    
    E2E --> Integration
    Integration --> Unit
```

### 10.2 Unit Testing

#### Frontend Unit Tests (Vitest + React Testing Library)
```typescript
// Example: Testing a component
describe('ProblemDisplay', () => {
  it('renders math problem correctly', () => {
    const problem = {
      question: 'What is 5 + 3?',
      answer: 8,
      options: [6, 7, 8, 9],
    };
    
    render(<ProblemDisplay problem={problem} />);
    
    expect(screen.getByText('What is 5 + 3?')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });
  
  it('calls onSubmit when answer is selected', async () => {
    const onSubmit = vi.fn();
    const problem = { /* ... */ };
    
    render(<ProblemDisplay problem={problem} onSubmit={onSubmit} />);
    
    await userEvent.click(screen.getByText('8'));
    
    expect(onSubmit).toHaveBeenCalledWith(8);
  });
});

// Example: Testing a service
describe('MathGenerator', () => {
  it('generates addition problems correctly', () => {
    const problem = generateProblem('addition', 1);
    
    expect(problem.mathSkill).toBe('addition');
    expect(problem.answer).toBe(problem.operand1 + problem.operand2);
  });
  
  it('respects difficulty level', () => {
    const level1 = generateProblem('multiplication', 1);
    const level5 = generateProblem('multiplication', 5);
    
    expect(level1.operand1).toBeLessThan(10);
    expect(level5.operand1).toBeGreaterThan(100);
  });
});
```

#### Backend Unit Tests (Vitest + Supertest)
```typescript
// Example: Testing an API endpoint
describe('POST /api/v1/missions/:missionId/complete', () => {
  it('completes mission and awards module', async () => {
    const response = await request(app)
      .post('/api/v1/missions/mission-1/complete')
      .set('Authorization', `Bearer ${token}`)
      .send({
        problemsAttempted: 10,
        problemsCorrect: 9,
        answers: [/* ... */],
      });
    
    expect(response.status).toBe(200);
    expect(response.body.rewards.modules).toHaveLength(1);
    expect(response.body.rewards.modules[0].moduleCategory).toBe('addition');
  });
  
  it('returns 401 without auth token', async () => {
    const response = await request(app)
      .post('/api/v1/missions/mission-1/complete')
      .send({/* ... */});
    
    expect(response.status).toBe(401);
  });
});

// Example: Testing a service
describe('MissionService', () => {
  it('calculates mission rewards correctly', () => {
    const rewards = calculateRewards({
      mathSkill: 'multiplication',
      difficultyLevel: 3,
      accuracy: 90,
    });
    
    expect(rewards.modules).toHaveLength(1);
    expect(rewards.modules[0].level).toBe(3);
  });
});
```

### 10.3 Integration Testing

```typescript
// Example: Testing mission flow
describe('Mission Flow Integration', () => {
  it('completes full mission lifecycle', async () => {
    // Start mission
    const startResponse = await request(app)
      .post('/api/v1/missions/mission-1/start')
      .set('Authorization', `Bearer ${token}`);
    
    expect(startResponse.status).toBe(200);
    
    // Complete mission
    const completeResponse = await request(app)
      .post('/api/v1/missions/mission-1/complete')
      .set('Authorization', `Bearer ${token}`)
      .send({
        problemsAttempted: 10,
        problemsCorrect: 10,
        answers: startResponse.body.problems.map(p => ({
          problemId: p.id,
          answer: p.answer,
        })),
      });
    
    expect(completeResponse.status).toBe(200);
    expect(completeResponse.body.rewards.modules).toBeDefined();
    
    // Verify module was unlocked
    const modulesResponse = await request(app)
      .get('/api/v1/player/modules')
      .set('Authorization', `Bearer ${token}`);
    
    expect(modulesResponse.body.modules).toContainEqual(
      expect.objectContaining({
        moduleCategory: 'addition',
        level: 1,
      })
    );
  });
});
```

### 10.4 E2E Testing (Future)

```typescript
// Using Playwright for E2E tests
describe('Mission Completion E2E', () => {
  it('user can complete a mission and unlock module', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Select mission
    await page.click('[data-testid="mission-board"]');
    await page.click('[data-testid="mission-addition-1"]');
    
    // Complete problems
    for (let i = 0; i < 10; i++) {
      const problem = await page.textContent('[data-testid="problem-text"]');
      const answer = solveProblem(problem);
      await page.fill('[data-testid="answer-input"]', answer.toString());
      await page.click('[data-testid="submit-answer"]');
    }
    
    // Verify reward
    await expect(page.locator('[data-testid="reward-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="unlocked-module"]')).toContainText('Laser Cannon');
  });
});
```

### 10.5 Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Happy paths for core features

---

## 11. Deployment Strategy

### 11.1 Development Environment

```bash
# Local development setup
npm install
npm run dev          # Start frontend (Vite)
npm run server:dev   # Start backend (Node.js)
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with test data
```

### 11.2 Build Process

```bash
# Frontend build
npm run build        # Vite build → dist/

# Backend build
npm run build:server # TypeScript compilation → server/dist/

# Type checking
npm run type-check   # Check TypeScript types

# Linting
npm run lint         # ESLint

# Testing
npm run test         # Run all tests
npm run test:coverage # Generate coverage report
```

### 11.3 Deployment Environments

#### Development
- **Frontend**: Local Vite dev server (http://localhost:5173)
- **Backend**: Local Node.js server (http://localhost:3000)
- **Database**: Docker PostgreSQL container

#### Staging (Future)
- **Frontend**: Vercel preview deployment
- **Backend**: Railway/Render staging environment
- **Database**: Managed PostgreSQL (staging instance)

#### Production (Future)
- **Frontend**: Vercel production deployment
- **Backend**: Railway/Render production environment
- **Database**: Managed PostgreSQL (production instance)
- **CDN**: Cloudflare

### 11.4 CI/CD Pipeline (Future)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run build:server
      
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: vercel --prod
      - name: Deploy to Railway
        run: railway up
```

### 11.5 Environment Variables

```bash
# .env.example

# Backend
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/spacemath
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Frontend
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Space Math Academy

# Optional
REDIS_URL=redis://localhost:6379
SENTRY_DSN=your-sentry-dsn
```

---

## 12. Development Workflow

### 12.1 Git Workflow

#### Branch Strategy
```
main              # Production-ready code
├── develop       # Integration branch
│   ├── feature/mission-system
│   ├── feature/combat-system
│   └── feature/ship-customization
└── hotfix/critical-bug
```

#### Commit Convention
```bash
# Format: <type>(<scope>): <subject>

feat(mission): add mission completion rewards
fix(combat): resolve shield recharge bug
docs(api): update authentication endpoints
test(mission): add unit tests for mission service
refactor(components): simplify ProblemDisplay component
```

### 12.2 Code Review Process

1. Create feature branch from `develop`
2. Implement feature with tests
3. Run linting and type checking
4. Create pull request with description
5. Automated CI checks run
6. Code review by team member
7. Address feedback
8. Merge to `develop`

### 12.3 Development Best Practices

#### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write self-documenting code
- Add comments for complex logic

#### File Organization
- Keep files under 200 lines
- One component per file
- Group related files in directories
- Use index.ts for clean imports

#### Performance
- Avoid premature optimization
- Profile before optimizing
- Use React DevTools Profiler
- Monitor bundle size

#### Security
- Never commit secrets
- Validate all inputs
- Sanitize user data
- Use environment variables

---

## 13. Monitoring & Logging (Future)

### 13.1 Error Tracking

```typescript
// Sentry integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error boundary
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

### 13.2 Analytics

```typescript
// Privacy-friendly analytics with Plausible
const trackEvent = (eventName: string, props?: object) => {
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
};

// Track mission completion
trackEvent('Mission Completed', {
  mathSkill: 'addition',
  difficulty: 1,
  accuracy: 90,
});
```

### 13.3 Logging

```typescript
// Winston logger (backend)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log important events
logger.info('Mission completed', {
  userId: user.id,
  missionId: mission.id,
  accuracy: 95,
});
```

---

## 14. Future Enhancements

### 14.1 Technical Improvements

- **Progressive Web App (PWA)**: Offline support, installable
- **WebSocket Integration**: Real-time multiplayer features
- **GraphQL API**: More flexible data fetching
- **Server-Side Rendering**: Improved SEO and performance
- **Microservices**: Split backend into smaller services

### 14.2 Feature Enhancements

- **AI-Powered Difficulty Adjustment**: Machine learning for adaptive difficulty
- **Voice Input**: Answer problems with voice
- **Accessibility**: Screen reader support, keyboard navigation
- **Internationalization**: Multi-language support
- **Mobile Apps**: Native iOS/Android versions

---

## Appendix A: Technology Alternatives Considered

### Frontend Frameworks
- **React** ✅ (Chosen): Large ecosystem, familiar, great tooling
- **Vue**: Simpler learning curve, but smaller ecosystem
- **Svelte**: Best performance, but less mature ecosystem

### State Management
- **Zustand** ✅ (Chosen): Lightweight, simple API, no boilerplate
- **Redux Toolkit**: More powerful, but more complex
- **Jotai**: Atomic state, but less documentation

### Backend Frameworks
- **Express** ✅ (Chosen): Minimal, flexible, well-documented
- **Fastify**: Faster, but less ecosystem
- **NestJS**: More structured, but heavier

### Databases
- **PostgreSQL** ✅ (Chosen): Relational, ACID compliant, mature
- **MongoDB**: Flexible schema, but less structure
- **SQLite**: Simple, but limited scalability

### ORMs
- **Drizzle** ✅ (Chosen): Type-safe, lightweight, modern
- **Prisma**: Great DX, but heavier
- **TypeORM**: Feature-rich, but complex

---

## Appendix B: Glossary

- **Module**: Upgradeable ship component (weapon, shield, armor)
- **Mission**: Discrete challenge with math problems and rewards
- **Sector**: Major region of space with multiple missions
- **Math Skill**: Category of math problems (addition, multiplication, etc.)
- **Difficulty Level**: 1-5 scale indicating problem complexity
- **Combat**: Turn-based battle system using equipped modules
- **Badge**: Achievement earned for completing specific challenges

---

## Appendix C: References

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Express.js Guide](https://expressjs.com/)

### Best Practices
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Design](https://restfulapi.net/)

---

**Document Status**: Initial Draft  
**Next Review**: After prototype development  
**Maintainer**: Development Team
