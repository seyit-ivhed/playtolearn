# Visual Style Guide: Space Math Academy

## Executive Summary

This visual style guide defines the aesthetic direction for Space Math Academy, ensuring a cohesive, engaging, and child-friendly experience. The design balances excitement and wonder with clarity and accessibility, creating an environment where young learners feel empowered and motivated.

---

## 1. Design Philosophy

### 1.1 Core Principles

**Wonder & Discovery**
- Evoke the excitement of space exploration
- Use vibrant colors that spark imagination
- Create a sense of adventure and possibility

**Clarity & Readability**
- Ensure math problems are always clearly visible
- Use high contrast for important information
- Maintain clean, uncluttered interfaces

**Progression & Achievement**
- Visual feedback for every accomplishment
- Clear visual hierarchy showing player growth
- Satisfying animations that reward success

**Inclusivity & Accessibility**
- Colorblind-friendly palette options
- Scalable text and UI elements
- Clear visual indicators beyond color alone

### 1.2 Target Aesthetic

- **Tone**: Optimistic, adventurous, empowering
- **Style**: Modern, semi-realistic space with playful elements
- **Mood**: Exciting but not overwhelming, challenging but supportive

---

## 2. Color Palette

### 2.1 Primary Colors

#### Deep Space Background
```
Primary Background: #0A0E27 (Deep Space Navy)
Secondary Background: #1A1F3A (Midnight Blue)
Tertiary Background: #2D3561 (Cosmic Blue)
```

#### Accent Colors (High Energy)
```
Primary Accent: #00D9FF (Cyan Glow) - Success, energy, shields
Secondary Accent: #FF6B35 (Solar Orange) - Warnings, fire, explosions
Tertiary Accent: #B537F2 (Nebula Purple) - Special abilities, rare items
Quaternary Accent: #39FF14 (Neon Green) - Correct answers, positive feedback
```

#### UI Colors
```
Success: #00FF88 (Bright Green) - Correct answers, achievements
Error: #FF4757 (Bright Red) - Incorrect answers, damage
Warning: #FFA502 (Amber) - Caution, low health
Info: #5F9EFF (Sky Blue) - Hints, information
Neutral: #8B93B0 (Slate Gray) - Disabled states, secondary text
```

### 2.2 Sector-Specific Palettes

#### Sector 1: Training Zone
```
Primary: #4A90E2 (Friendly Blue)
Secondary: #7ED321 (Safe Green)
Accent: #F5A623 (Warm Gold)
Theme: Welcoming, safe, educational
```

#### Sector 2: Asteroid Belt
```
Primary: #8B7355 (Rocky Brown)
Secondary: #C0C0C0 (Metallic Silver)
Accent: #FF8C42 (Rust Orange)
Theme: Industrial, rugged, mineral-rich
```

#### Sector 3: Ice Planets
```
Primary: #A8E6FF (Icy Blue)
Secondary: #E0F7FF (Frost White)
Accent: #4DD0E1 (Crystal Cyan)
Theme: Cold, crystalline, serene
```

#### Sector 4: Nebula Fields
```
Primary: #B537F2 (Nebula Purple)
Secondary: #FF6EC7 (Cosmic Pink)
Accent: #00D9FF (Electric Cyan)
Theme: Mysterious, colorful, ethereal
```

#### Sector 5: Alien Territory
```
Primary: #39FF14 (Alien Green)
Secondary: #8B00FF (Deep Violet)
Accent: #FFD700 (Golden Yellow)
Theme: Unknown, exotic, advanced
```

#### Sector 6: Black Hole Region
```
Primary: #1A0033 (Void Black)
Secondary: #6A0DAD (Dark Purple)
Accent: #FF00FF (Magenta Glow)
Theme: Dangerous, powerful, end-game
```

### 2.3 Gradient Usage

**Background Gradients**
- Use subtle gradients to add depth to space backgrounds
- Direction: Top to bottom or radial from center
- Example: `linear-gradient(180deg, #0A0E27 0%, #1A1F3A 100%)`

**UI Element Gradients**
- Buttons and cards can use gentle gradients for depth
- Keep gradients subtle (10-15% color variation)
- Example: `linear-gradient(135deg, #00D9FF 0%, #0099CC 100%)`

**Glow Effects**
- Use radial gradients for energy effects, shields, and highlights
- Example: `radial-gradient(circle, #00D9FF 0%, transparent 70%)`

---

## 3. Typography

### 3.1 Font Families

#### Primary Font: **Orbitron** (Headers, UI Elements)
- **Source**: Google Fonts
- **Weights**: Regular (400), Medium (500), Bold (700), Black (900)
- **Usage**: Game title, section headers, buttons, stats
- **Rationale**: Futuristic, tech-inspired, highly readable

#### Secondary Font: **Inter** (Body Text, Math Problems)
- **Source**: Google Fonts
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Usage**: Math problems, descriptions, dialogue, instructions
- **Rationale**: Excellent readability, modern, professional

#### Monospace Font: **JetBrains Mono** (Numbers, Calculations)
- **Source**: Google Fonts
- **Weights**: Regular (400), Bold (700)
- **Usage**: Math equations, numerical displays, code-like elements
- **Rationale**: Clear number differentiation, technical feel

### 3.2 Type Scale

```
Display (Game Title): 72px / 4.5rem - Orbitron Black
H1 (Page Headers): 48px / 3rem - Orbitron Bold
H2 (Section Headers): 36px / 2.25rem - Orbitron Bold
H3 (Subsection Headers): 28px / 1.75rem - Orbitron Medium
H4 (Card Headers): 24px / 1.5rem - Orbitron Medium
Body Large (Math Problems): 24px / 1.5rem - Inter SemiBold
Body (Standard Text): 18px / 1.125rem - Inter Regular
Body Small (Descriptions): 16px / 1rem - Inter Regular
Caption (Labels): 14px / 0.875rem - Inter Medium
Numbers (Stats, Scores): 32px / 2rem - JetBrains Mono Bold
```

### 3.3 Text Styling

**Line Height**
- Headers: 1.2
- Body text: 1.6
- Math problems: 1.4

**Letter Spacing**
- Headers: 0.02em
- Body: 0.01em
- All caps: 0.05em

**Text Colors**
```
Primary Text: #FFFFFF (White) - Main content
Secondary Text: #B8C5D6 (Light Gray) - Descriptions
Disabled Text: #6B7A8F (Medium Gray) - Inactive elements
Highlighted Text: #00D9FF (Cyan) - Important information
```

---

## 4. UI Components

### 4.1 Buttons

#### Primary Button (Call-to-Action)
```css
Background: linear-gradient(135deg, #00D9FF 0%, #0099CC 100%)
Text: #0A0E27 (Dark text for contrast)
Border: 2px solid #00FFFF
Border Radius: 12px
Padding: 16px 32px
Font: Orbitron Bold, 18px
Shadow: 0 4px 16px rgba(0, 217, 255, 0.4)

Hover State:
- Transform: translateY(-2px)
- Shadow: 0 6px 20px rgba(0, 217, 255, 0.6)
- Brightness: 110%

Active State:
- Transform: translateY(0)
- Shadow: 0 2px 8px rgba(0, 217, 255, 0.3)
```

#### Secondary Button (Alternative Actions)
```css
Background: transparent
Text: #00D9FF
Border: 2px solid #00D9FF
Border Radius: 12px
Padding: 16px 32px
Font: Orbitron Medium, 18px

Hover State:
- Background: rgba(0, 217, 255, 0.1)
- Border: 2px solid #00FFFF
```

#### Danger Button (Destructive Actions)
```css
Background: linear-gradient(135deg, #FF4757 0%, #CC3644 100%)
Text: #FFFFFF
Border: 2px solid #FF6B7A
Border Radius: 12px
Padding: 16px 32px
Font: Orbitron Bold, 18px
```

### 4.2 Cards

#### Standard Card
```css
Background: rgba(26, 31, 58, 0.8)
Border: 1px solid rgba(0, 217, 255, 0.2)
Border Radius: 16px
Padding: 24px
Backdrop Filter: blur(10px)
Shadow: 0 8px 32px rgba(0, 0, 0, 0.3)

Hover State:
- Border: 1px solid rgba(0, 217, 255, 0.5)
- Transform: translateY(-4px)
- Shadow: 0 12px 40px rgba(0, 0, 0, 0.4)
```

#### Mission Card
```css
Background: linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(45, 53, 97, 0.9) 100%)
Border: 2px solid rgba(0, 217, 255, 0.3)
Border Radius: 20px
Padding: 32px
Shadow: 0 8px 32px rgba(0, 0, 0, 0.4)

Header:
- Font: Orbitron Bold, 24px
- Color: #00D9FF
- Margin Bottom: 16px

Difficulty Stars:
- Color: #FFA502 (filled)
- Color: rgba(255, 165, 2, 0.2) (empty)
- Size: 20px
```

#### Module Card (Ship Components)
```css
Background: radial-gradient(circle at top, rgba(0, 217, 255, 0.15) 0%, rgba(26, 31, 58, 0.9) 100%)
Border: 2px solid #00D9FF
Border Radius: 16px
Padding: 20px
Shadow: 0 4px 16px rgba(0, 217, 255, 0.3)

Module Icon:
- Size: 64px × 64px
- Glow: 0 0 20px rgba(0, 217, 255, 0.6)

Module Level:
- Position: Top right corner
- Background: #B537F2
- Border Radius: 50%
- Size: 32px × 32px
- Font: JetBrains Mono Bold, 16px
```

### 4.3 Input Fields

#### Text Input
```css
Background: rgba(10, 14, 39, 0.6)
Border: 2px solid rgba(0, 217, 255, 0.3)
Border Radius: 8px
Padding: 12px 16px
Font: Inter Regular, 18px
Color: #FFFFFF

Focus State:
- Border: 2px solid #00D9FF
- Shadow: 0 0 0 4px rgba(0, 217, 255, 0.2)
- Outline: none

Placeholder:
- Color: rgba(184, 197, 214, 0.5)
```

#### Number Input (Math Answers)
```css
Background: rgba(10, 14, 39, 0.8)
Border: 3px solid #00D9FF
Border Radius: 12px
Padding: 16px 24px
Font: JetBrains Mono Bold, 32px
Color: #00FF88
Text Align: center
Width: 200px

Focus State:
- Border: 3px solid #00FFFF
- Shadow: 0 0 20px rgba(0, 217, 255, 0.5)
```

### 4.4 Progress Bars

#### Standard Progress Bar
```css
Container:
- Background: rgba(10, 14, 39, 0.6)
- Border: 1px solid rgba(0, 217, 255, 0.3)
- Border Radius: 20px
- Height: 24px
- Overflow: hidden

Fill:
- Background: linear-gradient(90deg, #00D9FF 0%, #00FF88 100%)
- Border Radius: 20px
- Height: 100%
- Transition: width 0.3s ease
- Shadow: 0 0 10px rgba(0, 217, 255, 0.5)

Label:
- Position: Centered
- Font: Inter Bold, 14px
- Color: #FFFFFF
- Text Shadow: 0 2px 4px rgba(0, 0, 0, 0.8)
```

#### Health Bar (Combat)
```css
Container:
- Background: rgba(139, 0, 0, 0.3)
- Border: 2px solid rgba(255, 71, 87, 0.5)
- Border Radius: 8px
- Height: 32px

Fill:
- Background: linear-gradient(90deg, #FF4757 0%, #FF6B7A 100%)
- Animation: pulse 2s infinite (when low health)

Low Health (<25%):
- Fill Color: #FF0000
- Animation: pulse + shake
```

#### Experience Bar
```css
Container:
- Background: rgba(10, 14, 39, 0.6)
- Border: 1px solid rgba(181, 55, 242, 0.3)
- Border Radius: 20px
- Height: 16px

Fill:
- Background: linear-gradient(90deg, #B537F2 0%, #FF6EC7 100%)
- Shadow: 0 0 10px rgba(181, 55, 242, 0.6)
```

### 4.5 Modals & Overlays

#### Modal Container
```css
Background: rgba(10, 14, 39, 0.95)
Border: 2px solid rgba(0, 217, 255, 0.5)
Border Radius: 24px
Padding: 40px
Max Width: 600px
Shadow: 0 20px 60px rgba(0, 0, 0, 0.8)
Backdrop Filter: blur(20px)

Close Button:
- Position: Top right
- Size: 40px × 40px
- Color: #8B93B0
- Hover Color: #FF4757
```

#### Overlay Background
```css
Background: rgba(0, 0, 0, 0.7)
Backdrop Filter: blur(4px)
```

### 4.6 Badges & Achievements

#### Badge Container
```css
Background: radial-gradient(circle, rgba(181, 55, 242, 0.2) 0%, transparent 70%)
Border: 2px solid #B537F2
Border Radius: 50%
Size: 80px × 80px
Padding: 12px
Shadow: 0 4px 20px rgba(181, 55, 242, 0.4)

Icon:
- Size: 56px × 56px
- Filter: drop-shadow(0 0 10px rgba(181, 55, 242, 0.8))

Locked State:
- Opacity: 0.3
- Filter: grayscale(100%)
- Border: 2px dashed rgba(139, 147, 176, 0.5)
```

---

## 5. Iconography

### 5.1 Icon Style

**Design Principles**
- Line-based with 2-3px stroke weight
- Rounded corners (4px radius)
- Consistent 24px × 24px base size (scalable)
- Simple, recognizable shapes
- Optional glow effects for active states

**Color Usage**
- Default: #B8C5D6 (Light Gray)
- Active: #00D9FF (Cyan)
- Success: #00FF88 (Green)
- Warning: #FFA502 (Amber)
- Danger: #FF4757 (Red)

### 5.2 Icon Categories

#### Navigation Icons
```
Home: House with antenna
Missions: Target/crosshair
Ship: Spaceship silhouette
Map: Star chart/constellation
Profile: Astronaut helmet
Settings: Gear/cog
```

#### Math Skill Icons
```
Addition: Plus symbol with sparkles
Subtraction: Minus symbol with arrows
Multiplication: X symbol with stars
Division: Division symbol with orbit
Fractions: Pie chart segments
Decimals: Decimal point with numbers
Algebra: Variable 'x' with equals sign
```

#### Module Type Icons
```
Weapons: Laser beam/missile
Shields: Energy barrier/dome
Armor: Plating/hull
Engine: Thruster flames
Utility: Wrench/tool
```

#### Status Icons
```
Health: Heart with pulse
Energy: Lightning bolt
Shield: Barrier symbol
Damage: Explosion/impact
Level Up: Arrow up with star
Achievement: Trophy/medal
```

### 5.3 Icon States

**Default State**
- Opacity: 100%
- Color: Base color
- No effects

**Hover State**
- Opacity: 100%
- Color: Brightened by 20%
- Glow: 0 0 8px (matching color)

**Active State**
- Opacity: 100%
- Color: #00D9FF
- Glow: 0 0 12px rgba(0, 217, 255, 0.8)

**Disabled State**
- Opacity: 30%
- Color: #6B7A8F
- Filter: grayscale(100%)

---

## 6. Animation Principles

### 6.1 Timing & Easing

**Duration Guidelines**
```
Micro-interactions: 150-200ms (button hover, icon changes)
Standard transitions: 300-400ms (card flips, panel slides)
Major animations: 500-800ms (level up, achievement unlock)
Cinematic moments: 1000-2000ms (sector unlock, boss defeat)
```

**Easing Functions**
```
ease-out: Default for most UI (cubic-bezier(0.25, 0.46, 0.45, 0.94))
ease-in-out: Smooth transitions (cubic-bezier(0.42, 0, 0.58, 1))
spring: Playful bounces (cubic-bezier(0.68, -0.55, 0.265, 1.55))
linear: Constant motion (for looping animations)
```

### 6.2 Animation Types

#### Feedback Animations

**Correct Answer**
```css
@keyframes correctAnswer {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
Duration: 400ms
Easing: spring
Color: Flash #00FF88
Particle Effect: Green sparkles burst
Sound: Positive chime
```

**Incorrect Answer**
```css
@keyframes incorrectAnswer {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
Duration: 300ms
Easing: ease-in-out
Color: Flash #FF4757 (brief)
Effect: Gentle shake
Sound: Soft buzz (not harsh)
```

**Level Up**
```css
@keyframes levelUp {
  0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
Duration: 800ms
Easing: spring
Effect: Burst of stars, glow pulse
Sound: Triumphant fanfare
```

#### UI Animations

**Button Hover**
```css
transition: transform 200ms ease-out, box-shadow 200ms ease-out;
transform: translateY(-2px);
box-shadow: Enhanced glow
```

**Card Entrance**
```css
@keyframes cardEntrance {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
Duration: 400ms
Easing: ease-out
Stagger: 100ms between cards
```

**Modal Open**
```css
@keyframes modalOpen {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
Duration: 300ms
Easing: ease-out
Background: Fade in simultaneously
```

#### Combat Animations

**Laser Attack**
```css
@keyframes laserFire {
  0% { width: 0; opacity: 1; }
  50% { width: 100%; opacity: 1; }
  100% { width: 100%; opacity: 0; }
}
Duration: 600ms
Color: #00D9FF with glow
Effect: Beam from ship to target
```

**Shield Activation**
```css
@keyframes shieldActivate {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
}
Duration: 500ms
Effect: Expanding energy dome
Idle: Gentle pulse animation
```

**Damage Impact**
```css
@keyframes damageImpact {
  0%, 100% { transform: translateX(0); filter: brightness(1); }
  25% { transform: translateX(-5px); filter: brightness(1.5); }
  75% { transform: translateX(5px); filter: brightness(1.5); }
}
Duration: 400ms
Color: Flash red briefly
Effect: Screen shake (subtle)
```

#### Ambient Animations

**Stars Twinkling**
```css
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
Duration: 2000-4000ms (randomized)
Easing: ease-in-out
```

**Ship Idle**
```css
@keyframes shipIdle {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
Duration: 3000ms
Easing: ease-in-out
Effect: Gentle floating motion
```

**Energy Glow Pulse**
```css
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(0, 217, 255, 0.4); }
  50% { box-shadow: 0 0 20px rgba(0, 217, 255, 0.8); }
}
Duration: 2000ms
Easing: ease-in-out
```

### 6.3 Performance Considerations

**Optimize for 60fps**
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes reflow)
- Use `will-change` sparingly for complex animations
- Limit simultaneous animations to 5-7 elements

**Reduce Motion**
- Respect `prefers-reduced-motion` media query
- Provide option to disable animations in settings
- Keep essential feedback (correct/incorrect) but simplify

---

## 7. Ship & Module Design

### 7.1 Ship Visual Hierarchy

**Base Ship (Starting)**
- Simple geometric shape (triangle/arrow)
- Size: 120px × 80px
- Color: #4A90E2 (Friendly Blue)
- Glow: Subtle cyan outline
- Details: Minimal, clean lines

**Upgraded Ship (Mid-Game)**
- More complex geometry with wings/fins
- Size: 160px × 100px
- Color: Gradient from #00D9FF to #4A90E2
- Glow: Enhanced cyan with energy trails
- Details: Panel lines, engine glow, module slots visible

**Advanced Ship (End-Game)**
- Intricate design with multiple sections
- Size: 200px × 120px
- Color: Multi-color gradient with metallic accents
- Glow: Intense energy effects, particle trails
- Details: Animated components, visible modules, special effects

### 7.2 Module Visual Design

#### Weapons

**Laser Cannon (Addition)**
```
Icon: Straight beam emitter
Color: #00D9FF (Cyan)
Effect: Straight line beam
Levels:
- Level 1: Single thin beam
- Level 3: Thicker beam with glow
- Level 5: Triple beam with intense glow
```

**Missile Launcher (Subtraction)**
```
Icon: Projectile launcher
Color: #FF6B35 (Solar Orange)
Effect: Projectile with trail
Levels:
- Level 1: Single missile
- Level 3: Dual missiles
- Level 5: Missile barrage with explosions
```

**Plasma Beam (Multiplication)**
```
Icon: Wave emitter
Color: #B537F2 (Nebula Purple)
Effect: Wavy energy beam
Levels:
- Level 1: Thin wave
- Level 3: Wide wave with particles
- Level 5: Massive wave with lightning
```

**Ion Blaster (Division)**
```
Icon: Sphere projector
Color: #39FF14 (Neon Green)
Effect: Energy sphere projectile
Levels:
- Level 1: Small sphere
- Level 3: Larger sphere with electric arcs
- Level 5: Massive sphere with chain lightning
```

#### Shields

**Energy Shield (Fractions)**
```
Icon: Hexagonal barrier
Color: #00D9FF (Cyan)
Effect: Translucent dome
Levels:
- Level 1: Faint hexagonal pattern
- Level 3: Bright hexagons with energy flow
- Level 5: Intense shield with particle effects
Idle: Gentle pulse animation
Active: Ripple effect on impact
```

**Deflector Shield (Decimals)**
```
Icon: Angular barrier
Color: #5F9EFF (Sky Blue)
Effect: Geometric panels
Levels:
- Level 1: Simple panels
- Level 3: Rotating panels with glow
- Level 5: Multi-layered rotating panels
```

#### Armor

**Hull Plating**
```
Visual: Metallic panels on ship
Color: #C0C0C0 (Metallic Silver) with #00D9FF highlights
Levels:
- Level 1: Basic plating
- Level 3: Reinforced plating with rivets
- Level 5: Advanced composite with energy lines
```

### 7.3 Enemy Ship Design

**Space Pirates**
```
Shape: Asymmetric, scrappy
Color: #8B4513 (Rusty Brown) with #FF6B35 accents
Size: Similar to player ship
Details: Weathered, patched together
Threat Level: Medium
```

**Asteroid Drones**
```
Shape: Spherical with appendages
Color: #696969 (Gray) with #FFA502 lights
Size: Small (80px × 80px)
Details: Mechanical, simple
Threat Level: Low
```

**Alien Scouts**
```
Shape: Sleek, organic curves
Color: #39FF14 (Alien Green) with #8B00FF accents
Size: Small-medium (100px × 70px)
Details: Smooth, bio-mechanical
Threat Level: Medium-High
```

**Capital Ships (Bosses)**
```
Shape: Large, imposing
Color: Sector-specific with red accents
Size: 300px × 200px
Details: Multiple sections, animated components
Threat Level: Very High
```

---

## 8. Background & Environment

### 8.1 Space Background

**Base Layer (Deep Space)**
```css
Background: radial-gradient(ellipse at center, #1A1F3A 0%, #0A0E27 100%)
```

**Star Field**
- Small stars: 1-2px white dots, opacity 0.3-0.8
- Medium stars: 3-4px white dots, opacity 0.5-1.0
- Large stars: 5-6px white dots with subtle glow
- Density: 100-150 stars per screen
- Animation: Slow twinkle (2-4s random intervals)

**Nebula Effects**
```css
Background: radial-gradient(circle at 30% 40%, rgba(181, 55, 242, 0.15) 0%, transparent 50%)
Blend Mode: screen
Animation: Slow drift (30-60s)
```

**Parallax Layers**
- Layer 1 (Far): Distant stars, slowest movement (0.2x scroll speed)
- Layer 2 (Mid): Nebula clouds, medium movement (0.5x scroll speed)
- Layer 3 (Near): Larger stars, faster movement (0.8x scroll speed)
- Layer 4 (Foreground): Occasional asteroids/debris (1.2x scroll speed)

### 8.2 Sector-Specific Environments

#### Training Zone
```
Background: Friendly blue tones
Elements: Space station in background, guide beacons
Lighting: Bright, welcoming
Particles: Gentle floating lights
```

#### Asteroid Belt
```
Background: Rocky brown and gray
Elements: Floating asteroids, debris fields
Lighting: Harsh, directional
Particles: Dust clouds, small rocks
```

#### Ice Planets
```
Background: Icy blue and white
Elements: Frozen planets, ice crystals
Lighting: Cool, reflective
Particles: Snowflakes, ice shards
```

#### Nebula Fields
```
Background: Purple, pink, cyan swirls
Elements: Colorful gas clouds, energy storms
Lighting: Vibrant, multi-colored
Particles: Energy wisps, glowing motes
```

#### Alien Territory
```
Background: Green and violet
Elements: Alien structures, unknown technology
Lighting: Eerie, pulsing
Particles: Bio-luminescent spores, energy fields
```

#### Black Hole Region
```
Background: Deep purple and black
Elements: Gravitational lensing, event horizon
Lighting: Minimal, dramatic
Particles: Matter streams, gravitational distortion
```

---

## 9. Accessibility

### 9.1 Colorblind Modes

#### Deuteranopia (Red-Green)
```
Success: #0099FF (Blue) instead of green
Error: #FF9900 (Orange) instead of red
Use patterns/icons in addition to color
```

#### Protanopia (Red-Green)
```
Similar adjustments to Deuteranopia
Enhanced contrast for all elements
```

#### Tritanopia (Blue-Yellow)
```
Success: #00FF00 (Green)
Warning: #FF0000 (Red)
Info: #FF00FF (Magenta)
```

### 9.2 High Contrast Mode

```
Background: #000000 (Pure Black)
Foreground: #FFFFFF (Pure White)
Accent: #FFFF00 (Yellow)
Borders: 3px solid white
Remove gradients and transparency
Increase all text sizes by 20%
```

### 9.3 Text Scaling

**Supported Scales**
- 100% (Default)
- 125% (Large)
- 150% (Extra Large)
- 200% (Maximum)

**Implementation**
- Use rem units for all text
- Ensure UI scales proportionally
- Test at all scale levels
- Maintain minimum touch target size (44px × 44px)

### 9.4 Motion Sensitivity

**Reduced Motion Mode**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Settings Toggle**
- Option to disable all animations
- Option to disable background animations only
- Option to disable particle effects
- Keep essential feedback (correct/incorrect) simplified

---

## 10. Responsive Design

### 10.1 Breakpoints

```
Desktop Large: 1920px and above
Desktop: 1280px - 1919px
Laptop: 1024px - 1279px
Tablet Landscape: 768px - 1023px
Tablet Portrait: 600px - 767px
Mobile: Below 600px (future consideration)
```

### 10.2 Layout Adaptations

#### Desktop (1280px+)
- Three-column layouts where appropriate
- Side panels for stats and inventory
- Large ship visualizations
- Full-featured UI with all elements visible

#### Laptop (1024px - 1279px)
- Two-column layouts
- Collapsible side panels
- Medium ship visualizations
- Slightly reduced spacing

#### Tablet Landscape (768px - 1023px)
- Single column with tabs
- Overlay panels instead of side panels
- Smaller ship visualizations
- Touch-optimized buttons (min 44px)

#### Tablet Portrait (600px - 767px)
- Vertical stacking
- Full-screen modals
- Simplified navigation
- Larger touch targets

---

## 11. Loading & Transitions

### 11.1 Loading States

#### Initial Load
```
Background: Deep space gradient
Center: Animated spaceship logo
Effect: Pulsing glow, rotating stars
Progress Bar: Cyan gradient with percentage
Text: "Preparing for launch..." (rotating tips)
```

#### Mission Load
```
Background: Sector-specific gradient
Center: Mission icon with glow
Effect: Particles flowing inward
Progress: Circular progress indicator
Text: Mission name and objective
Duration: 2-3 seconds
```

#### Transition Between Sectors
```
Effect: Hyperspace jump animation
Visual: Streaking stars, speed lines
Duration: 1.5 seconds
Sound: Whoosh/warp sound
```

### 11.2 Skeleton Screens

**Card Skeleton**
```css
Background: linear-gradient(90deg, rgba(26, 31, 58, 0.8) 0%, rgba(45, 53, 97, 0.8) 50%, rgba(26, 31, 58, 0.8) 100%)
Animation: shimmer 1.5s infinite
Border Radius: 16px
```

**Text Skeleton**
```css
Background: rgba(139, 147, 176, 0.3)
Border Radius: 4px
Animation: pulse 1.5s infinite
```

---

## 12. Sound Design (Visual Indicators)

While this is primarily a visual guide, sound effects should have visual accompaniment:

### 12.1 Visual Sound Indicators

**Correct Answer**
- Visual: Green checkmark with burst
- Particle: Green sparkles
- Glow: Bright green flash

**Incorrect Answer**
- Visual: Red X (brief, not harsh)
- Effect: Gentle shake
- Glow: Subtle red outline (brief)

**Level Up**
- Visual: Star burst, rays of light
- Particle: Golden sparkles shower
- Glow: Intense golden aura

**Combat Hit**
- Visual: Impact flash at contact point
- Particle: Explosion debris
- Glow: Bright flash matching weapon color

**Shield Block**
- Visual: Ripple effect on shield
- Particle: Energy dispersal
- Glow: Shield brightens briefly

---

## 13. Implementation Guidelines

### 13.1 CSS Architecture

**Recommended Structure**
```
styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── colors.css
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── inputs.css
│   └── modals.css
├── animations/
│   ├── feedback.css
│   ├── transitions.css
│   └── combat.css
├── layouts/
│   ├── grid.css
│   └── responsive.css
└── themes/
    ├── sectors.css
    └── accessibility.css
```

**CSS Variables**
```css
:root {
  /* Colors */
  --color-primary: #00D9FF;
  --color-background: #0A0E27;
  --color-success: #00FF88;
  --color-error: #FF4757;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Typography */
  --font-primary: 'Orbitron', sans-serif;
  --font-secondary: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Borders */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 300ms ease-out;
  --transition-slow: 500ms ease-out;
}
```

### 13.2 Asset Organization

**Image Assets**
```
assets/
├── ships/
│   ├── player/
│   │   ├── base.svg
│   │   ├── upgraded.svg
│   │   └── advanced.svg
│   └── enemies/
│       ├── pirate.svg
│       ├── drone.svg
│       └── scout.svg
├── modules/
│   ├── weapons/
│   ├── shields/
│   └── armor/
├── icons/
│   ├── navigation/
│   ├── math-skills/
│   └── status/
├── backgrounds/
│   ├── sectors/
│   └── nebulas/
└── effects/
    ├── particles/
    └── explosions/
```

**Naming Conventions**
- Use kebab-case: `laser-cannon-level-3.svg`
- Include size in filename if multiple: `ship-icon-64.svg`
- Use descriptive names: `nebula-purple-background.jpg`

### 13.3 Performance Optimization

**Image Optimization**
- Use SVG for icons and UI elements (scalable, small file size)
- Use WebP for backgrounds with PNG fallback
- Compress all images (target: <100KB per image)
- Use sprite sheets for animations

**CSS Optimization**
- Minimize use of box-shadow (expensive)
- Use transform for animations (GPU-accelerated)
- Avoid animating layout properties
- Use will-change sparingly

**Loading Strategy**
- Critical CSS inline in HTML
- Lazy load images below the fold
- Preload fonts
- Use resource hints (preconnect, prefetch)

---

## 14. Design Tokens

### 14.1 Spacing Scale

```
--space-0: 0px
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### 14.2 Z-Index Scale

```
--z-base: 0
--z-dropdown: 100
--z-sticky: 200
--z-fixed: 300
--z-modal-backdrop: 400
--z-modal: 500
--z-popover: 600
--z-tooltip: 700
--z-notification: 800
```

### 14.3 Opacity Scale

```
--opacity-0: 0
--opacity-10: 0.1
--opacity-20: 0.2
--opacity-30: 0.3
--opacity-40: 0.4
--opacity-50: 0.5
--opacity-60: 0.6
--opacity-70: 0.7
--opacity-80: 0.8
--opacity-90: 0.9
--opacity-100: 1
```

---

## 15. Quality Checklist

Before implementing any new visual element, ensure:

### 15.1 Consistency
- [ ] Uses colors from defined palette
- [ ] Uses typography from type scale
- [ ] Uses spacing from spacing scale
- [ ] Follows established patterns
- [ ] Matches sector theme (if applicable)

### 15.2 Accessibility
- [ ] Meets WCAG AA contrast ratio (4.5:1 for text)
- [ ] Works with colorblind modes
- [ ] Scales properly with text size adjustments
- [ ] Has reduced motion alternative
- [ ] Touch targets are minimum 44px × 44px

### 15.3 Performance
- [ ] Animations use transform/opacity
- [ ] Images are optimized
- [ ] No layout thrashing
- [ ] Runs at 60fps
- [ ] Respects prefers-reduced-motion

### 15.4 Responsiveness
- [ ] Works at all breakpoints
- [ ] Touch-friendly on tablets
- [ ] Readable at all sizes
- [ ] No horizontal scrolling

### 15.5 User Experience
- [ ] Clear visual hierarchy
- [ ] Immediate feedback for interactions
- [ ] Loading states for async actions
- [ ] Error states are helpful
- [ ] Success states are celebratory

---

## 16. Future Considerations

### 16.1 Themes

**Dark Mode** (Default)
- Current design

**Light Mode** (Future)
```
Background: #F0F4F8 (Light Gray)
Cards: #FFFFFF (White)
Text: #1A1F3A (Dark Blue)
Accents: Maintain vibrant colors
```

**Custom Themes** (Future)
- Allow players to choose color schemes
- Maintain accessibility in all themes
- Save preference per user

### 16.2 Seasonal Events

**Holiday Themes**
- Temporary color palette adjustments
- Special particle effects
- Themed backgrounds
- Limited-time badges

### 16.3 Advanced Graphics

**WebGL/Canvas** (Future Enhancement)
- More complex particle systems
- Advanced lighting effects
- 3D ship models
- Dynamic backgrounds

---

## Appendix

### A. Color Palette Reference

#### Quick Reference Table

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Deep Space Navy | #0A0E27 | rgb(10, 14, 39) | Primary background |
| Midnight Blue | #1A1F3A | rgb(26, 31, 58) | Secondary background |
| Cyan Glow | #00D9FF | rgb(0, 217, 255) | Primary accent, success |
| Solar Orange | #FF6B35 | rgb(255, 107, 53) | Warnings, fire |
| Nebula Purple | #B537F2 | rgb(181, 55, 242) | Special abilities |
| Neon Green | #39FF14 | rgb(57, 255, 20) | Correct answers |
| Bright Green | #00FF88 | rgb(0, 255, 136) | Success states |
| Bright Red | #FF4757 | rgb(255, 71, 87) | Errors, damage |
| Amber | #FFA502 | rgb(255, 165, 2) | Caution, warnings |
| Sky Blue | #5F9EFF | rgb(95, 158, 255) | Info, hints |
| Slate Gray | #8B93B0 | rgb(139, 147, 176) | Disabled, secondary |

### B. Font Loading

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### C. Browser Support

**Minimum Supported Versions**
- Chrome: 90+
- Firefox: 88+
- Safari: 14+
- Edge: 90+

**Required Features**
- CSS Grid
- CSS Custom Properties
- CSS Animations
- SVG support
- WebP support (with fallback)

### D. Resources

**Design Tools**
- Figma: UI mockups and prototypes
- Adobe Illustrator: SVG icon creation
- Photoshop: Image editing and optimization

**Color Tools**
- Coolors.co: Palette generation
- WebAIM Contrast Checker: Accessibility testing
- Colorblind Web Page Filter: Colorblind simulation

**Animation Tools**
- Lottie: Complex animations
- GSAP: Advanced JavaScript animations
- CSS Animation Generator: Quick prototyping

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-26  
**Author**: Seyit Ivhed  
**Status**: Initial Draft  
**Related Documents**: [Game Design Document](file:///Users/seyitivhed/Github/playtolearn/docs/game-design-document.md)
