---
name: Composer
description: Use this skill to create music generation prompts.
---

# Composer Skill

This skill is designed to generate music generation prompts for Udio, tailored to the "Math Quest Adventures" game. The music should enhance the game's atmosphere, be suitable for children (6-8 years old), and reflect the specific biome or game mode.

## Context

"Math Quest Adventures" is an educational fantasy RPG for children.
- **Tone**: Wholesome, Heroic, Magical, Adventurous, Vibrant.
- **Target Audience**: Children 6-8 years old. WARNING: Avoid dark, scary, or overly aggressive music.
- **Biomes**:
    1.  **Desert & Ancient City**: Middle Eastern/Assyrian inspiration.
    2.  **Jade Peaks**: East Asian (misty mountains, cherry blossoms) inspiration.
    3.  **Sunfire Savannah**: African (golden grasslands, ancestral spirits) inspiration.

## Instructions

When the user asks for music prompts, follow these steps:

1.  **Analyze the Request**: Identify the *Game Mode* (Menu, Exploration, Battle, Boss, Victory) and the *Biome/Theme*.

2.  **Select Musical Elements**:
    *   **Genre**: Generally Orchestral / Fantasy Adventure.
        *   *Biome Specifics*:
            *   **Desert**: World Music (Middle Eastern), Orchestral Hybrid.
            *   **Jade Peaks**: World Music (East Asian), Orchestral Hybrid.
            *   **Savannah**: World Music (African), Orchestral Hybrid.
    *   **Instruments**:
        *   **General**: Strings (Violin, Cello), Brass (French Horns, Trumpets for heroism), Woodwinds (Flute, Oboe), Piano, Harp, Percussion (Timpani, Snare).
        *   **Desert**: Oud, Kanun, Ney, Dumbek/Darbuka, Finger Cymbals.
        *   **Jade Peaks**: Koto, Shakuhachi, Shamisen, Taiko Drums, Erhu.
        *   **Savannah**: Kalimba, Kora, Djembe, Balafon, Shekere.
    *   **Mood**:
        *   **Menu**: Welcoming, magical, inviting, calm, wondrous.
        *   **Exploration/Map**: Adventurous, curious, flowing, atmospheric, slightly mysterious but safe.
        *   **Battle**: Energetic, rhythmic, heroic, determined, catchy.
        *   **Boss Fight**: Intense, dramatic, epic, high-stakes, driving rhythm.
        *   **Victory**: Triumphant, uplifting, celebratory, short.
        *   **Defeat**: Gentle, encouraging (not sad/depressing), reflective.
    *   **Tempo**:
        *   **Menu/Exploration**: 80-110 BPM.
        *   **Battle**: 120-140 BPM.
        *   **Boss**: 140-160 BPM.

3.  **Construct the Prompt**:
    Create a detailed prompt string for Udio. The format should be:
    `[Genre/Style], [Instruments], [Mood/Vibe], [Tempo/Rhythm], [Descriptive Keywords]`

    *Example for Desert Battle*:
    `Orchestral fantasy battle music, Middle Eastern influence, Oud and Darbuka feature, driving percussion, heroic brass melody, energetic, adventurous, 130 BPM, video game soundtrack, loopable`

4.  **Output**:
    Present the generated prompt clearly. You can provide 2-3 variations if appropriate (e.g., one more orchestral, one more percussion-heavy).

5.  **Storage**:
    Save the generated prompt to `/docs/prompts/music.md`.
    *   Append the new prompt to the end of the file.
    *   Ensure it follows the Output Format structure.
    *   If the file does not exist, create it.

## Output Format

```markdown
### Music Prompt for [Scene/Context]

**Description**: [Brief explanation of the musical goal]

**Udio Prompt**:
> [The Prompt String]

**Musical Elements**:
- **Genre**: [Genre]
- **Key Instruments**: [List]
- **BPM**: [Approximate]
```
