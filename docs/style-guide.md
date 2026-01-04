# Math Quest Adventures - Project Style Guide

## 1. Design Philosophy
**Theme:** High-Fantasy RPG (Magic, Knights, Questing).
**Vibe:** Heroic, Enchanting, Friendly, and Accessible.
**Target Audience:** Children (Primary/Elementary level).
**Core Principle:** "Every math problem solved is a magical spell cast."

The UI should feel tactile and magical, moving away from the sleek, digital sci-fi aesthetic of the previous iteration.

## 2. Color Palette ("The Realm")

We use CSS variables for all coloring. Existing code uses these variable names, so we re-map them to fantasy colors.

### Backgrounds
- **Primary (Night Sky/Void):** `#1a0b2e` (Deep Indigo) - *Was Space Black*
- **Secondary (Panels/Stone):** `#2d1b4e` (Dark Mystic Purple) - *Was Dark Blue*
- **Tertiary (Paper/Parchment):** `#f0e6d2` (Warm Parchment) - *Used for text containers*

### Functional Colors
- **Attack / Danger:** `#ff4757` (Dragon Red)
- **Defense / Shield:** `#2ed573` (Emerald Guard) or `#1e90ff` (Mana Blue)
- **Magic / Special:** `#a55eea` (Wizard Purple)

### Text
- **Primary (Light):** `#ffffff` (On dark backgrounds)
- **Primary (Dark):** `#2f3542` (On parchment backgrounds)
- **Accent:** `#ffd32a` (Gold Text)

## 3. Typography

- **Headings (Titles):** `'Fredoka', sans-serif` or `'Cinzel', serif`
  - *Must look adventurous but readable.*
- **Body (Content):** `'Nunito', sans-serif` or `'Quicksand', sans-serif`
  - *Rounded, friendly, easy to read for kids.*
- **Numbers (Math):** `'JetBrains Mono', monospace`
  - *Clear distinction for math problems.*

## 4. UI Components

#### Navigation Buttons (Chronicle)
For page navigation in the Chronicle, use clean, icon-only buttons (e.g., Lucide Chevrons) without circular borders or backgrounds to maintain an elegant, book-like feel.
- **Color:** Inherit theme brown (`#4a3721`) or accent gold (`#ffa502`) on hover.
- **Interaction:** Subtle scaling and color shift on hover/tap.

### Cards ("Spell Cards")
Containers for Companions or Missions.
- **Background:** Dark semi-transparent purple or Parchment texture.
- **Border:** Fancy corner radius (16px) or golden borders.
- **Effects:** Slight tilt or lift on hover.

### Icons
Use emoji until custom SVG assets are available.
- **Attack:** ⚔️ (Swords)
- **Defense:** 🛡️ (Shield)
- **Magic/Special:** ✨ (Sparkles), ⚡ (Bolt), ❤️ (Heart)
- **Close/Cancel:** ✖️ (Simple X icon)

### Modal Close Buttons
To maintain a clean, immersive look, modal close buttons in the top-right should be:
- **Icon:** Simple `X` or `X` icon (e.g., Lucide `X`).
- **Style:** Transparent background, no border.
- **Color:** Accent color (Gold) with partial opacity (e.g., 0.7).
- **Hover:** Full opacity, slight scale up (1.1x), and/or color shift.

## 5. Visual Effects & Particles

### Particle System (`tsparticles`)
We use `tsparticles` for rich visual effects like confetti, magical sparkles, and ambient backgrounds.

**Guidelines:**
- **Library:** `@tsparticles/react` with the full `tsparticles` bundle (for emitters).
- **Component:** Use the reusable `GameParticles` component.
- **Usage:**
  - **High Intensity:** Level ups, boss defeats, major rewards (e.g., Confetti).
  - **Low Intensity:** Ambient magic, background stars (e.g., Subtle floaters).
- **Performance:** Ensure particles are destroyed after use or kept to a reasonable count (<200) for mobile performance.

## 6. CSS Variable Mapping
Use this reference when creating new components to ensure they inherit the theme.

| CSS Variable | Fantasy Meaning | Hex Code |
| :--- | :--- | :--- |
| `--color-bg-primary` | World Background (Indigo) | `#1a0b2e` |
| `--color-bg-secondary` | Panel Background (Dark Purple) | `#2d1b4e` |
| `--color-accent-primary` | Main Highlight (Gold) | `#ffa502` |
| `--color-accent-secondary` | Action/Attack (Red) | `#ff4757` |
| `--color-text-primary` | Main Text (White/Off-white) | `#f1f2f6` |
