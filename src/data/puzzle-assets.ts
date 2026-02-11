/**
 * Puzzle Asset Mappings
 * This file maps puzzle-related assets to their images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

export const RUNE_ASSETS = [
    new URL('../assets/images/runes/rune-1.png', import.meta.url).href,
    new URL('../assets/images/runes/rune-2.png', import.meta.url).href,
    new URL('../assets/images/runes/rune-3.png', import.meta.url).href,
    new URL('../assets/images/runes/rune-4.png', import.meta.url).href,
    new URL('../assets/images/runes/rune-5.png', import.meta.url).href,
    new URL('../assets/images/runes/rune-6.png', import.meta.url).href,
    new URL('../assets/images/runes/rune-7.png', import.meta.url).href,
];

export const PUZZLE_UI_ASSETS = {
    MIRROR: {
        PEDESTAL: new URL('../assets/images/puzzles/pedestal.png', import.meta.url).href,
        MIRROR_FRAME: new URL('../assets/images/puzzles/mirror/mirror.png', import.meta.url).href,
    },
    BALANCE: {
        BACKGROUND: new URL('../assets/images/puzzles/balance/background.jpg', import.meta.url).href,
        CHAIN: new URL('../assets/images/puzzles/balance/chain.png', import.meta.url).href,
        WEIGHT: new URL('../assets/images/puzzles/balance/weight.png', import.meta.url).href,
        HEAVY_WEIGHT: new URL('../assets/images/puzzles/balance/heavy-weight.png', import.meta.url).href,
    }
} as const;
