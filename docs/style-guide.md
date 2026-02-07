# Math Quest Adventures - Project Style Guide

## 1. Design Philosophy
**Theme:** High-Fantasy RPG (Magic, Knights, Questing).
**Vibe:** Heroic, Enchanting, Friendly, and Accessible.
**Target Audience:** Children (Primary/Elementary level).
**Core Principle:** "Every math problem solved is a magical spell cast."

The UI should feel tactile and magical, utilizing rich textures (parchment, leather, stone) and dynamic lighting effects (glows, particles).

## 2. Color Palette ("The Realm")

We use CSS variables for all coloring defined in `src/styles/global.css`.

### Backgrounds
- **World Background (Void/Sky):** `var(--color-bg-primary)` / `#1a0b2e` (Deep Indigo)
- **Panel Background (Main UI):** `var(--color-chronicle-bg)` / `#e9dcc9` (Tactile Parchment)
- **Secondary Panel (Dark):** `var(--color-bg-secondary)` / `#2d1b4e` (Reserved for deep overlays or combat UI)
- **Overlay Background:** `var(--color-bg-overlay)` / `rgba(0, 0, 0, 0.85)`

### Chronicle & Book Theme
- **Parchment Page:** `var(--color-chronicle-bg)` / `#e9dcc9`
- **Dark Leather Cover:** `#3e3020` (Internal hex)
- **Ink Text:** `var(--color-chronicle-text)` / `#4a3721`
- **Dark Ink/Header:** `var(--color-chronicle-text-dark)` / `#2c1e11`
- **Gold Accent:** `var(--color-chronicle-accent)` / `#8b6532`
- **Wax Seal:** `var(--color-chronicle-seal)` / `#8b0000`

### Functional Colors
- **Action/Attack (Danger):** `var(--color-danger)` / `#ff4757` (Dragon Red)
- **Success/Defense (Emerald):** `var(--color-success)` / `#2ed573` (Emerald Guard)
- **Magic/Info (Mana):** `var(--color-info)` / `#1e90ff` (Mana Blue)
- **Warning/Treasure (Gold):** `var(--color-warning)` / `#ffa502`

### Text
- **Primary (Light):** `var(--color-text-primary)` / `#f1f2f6` (On dark backgrounds)
- **Secondary (Dim):** `var(--color-text-secondary)` / `#ced6e0`
- **Inverse (Dark):** `var(--color-text-inverse)` / `#ffffff` (On buttons)

## 3. Typography

- **Headings (Titles):** `var(--font-display)`
  - *Families:* 'Fredoka', 'Cinzel', sans-serif.
  - *Usage:* Major titles often use 'Cinzel' for a legendary feel, while UI headers use 'Fredoka' for readability.
- **Body (Content):** `var(--font-body)`
  - *Families:* 'Nunito', sans-serif.
  - *Usage:* All standard reading text. Readable, rounded, and friendly.

## 4. UI Components

### Buttons
**Primary Chronicle Button (Gold/Magical):**
- **Background:** Linear Gradient (`#FADCA1` to `#D4AF37`)
- **Text:** Dark Brown (`#2c1e11`)
- **Typography:** Uppercase, Bold, Letter-spacing `0.1em`
- **Border:** `#8a702b`
- **Shadow:** `0 4px 12px rgba(0, 0, 0, 0.4)`
- **Hover:** Brightness `1.1`, Transform `translateY(-2px)`

**Secondary Chronicle Button (Wood/Leather):**
- **Background:** Dark Brown (`#2a2015`)
- **Text:** Muted Beige (`#c4b5a3`) -> Gold on hover (`#FADCA1`)
- **Border:** `#5c4d3c`
- **Hover:** Lighter Brown (`#3e3020`), Transform `translateY(-1px)`

### Navigation (Chronicle)
- **Style:** Clean, icon-only buttons (e.g., Chevrons).
- **Color:** Inherit theme brown or accent gold.
- **Interaction:** Subtle scaling and color shift.

### Cards ("Spell Cards")
- **Background:** Parchment texture (`var(--color-chronicle-bg)`) for a consistent book-like feel. Dark purple may be used for secondary content.
- **Border Radius:** `var(--radius-lg)` (16px).
- **Shadow:** `var(--shadow-md)`.

### Modals
- **Close Button:** Simple 'X', transparent background, color matching **Dark Ink** (`var(--color-chronicle-text)`).
- **Background:** Default to **Parchment** (`var(--color-chronicle-bg)`) for a tactile, book-like feel. Text should be **Dark Ink** (`var(--color-chronicle-text-dark)`).

## 5. Visual Effects & Particles

### Particle System (`tsparticles`)
- **Library:** `@tsparticles/react`
- **Component:** `GameParticles`
- **Usage:**
  - **High Intensity:** Level ups, boss defeats (Confetti).
  - **Low Intensity:** Ambient magic, cover page sparkles (Subtle floaters).

### Animations
- **Book Opening:** 3D perspective transform (`preserve-3d`, `rotateY`).
- **Rune Glow:** Radial gradient pulse animation (`rgba(255, 215, 0, 0.6)`).

## 6. CSS Variable Mapping
Refer to `src/styles/global.css` for the source of truth.

| CSS Variable | Fantasy Meaning | Hex Code |
| :--- | :--- | :--- |
| `--color-bg-primary` | Void/Sky | `#1a0b2e` |
| `--color-bg-secondary` | Mystic Stone | `#2d1b4e` |
| `--color-chronicle-bg` | Parchment | `#e9dcc9` |
| `--color-chronicle-text` | Old Ink | `#4a3721` |
| `--color-brand-accent` | Treasure Gold | `#ffa502` |
| `--color-danger` | Dragon Red | `#ff4757` |
