/**
 * Adventure Asset Mappings
 * This file maps adventure IDs to their illustrations and map images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

const chapter1Illustration = new URL('../assets/images/chapters/chapter-1.png', import.meta.url).href;
const chapter2Illustration = new URL('../assets/images/chapters/chapter-2.png', import.meta.url).href;
const adventure1Map = new URL('../assets/images/maps/adventure-1.png', import.meta.url).href;
const adventure2Map = new URL('../assets/images/maps/adventure-2.png', import.meta.url).href;

export const ADVENTURE_ILLUSTRATIONS: Record<string, string> = {
    '1': chapter1Illustration,
    '2': chapter2Illustration,
};

export const ADVENTURE_MAP_IMAGES: Record<string, string> = {
    '1': adventure1Map,
    '2': adventure2Map,
};

/**
 * Get illustration for an adventure by ID
 */
export const getAdventureIllustration = (adventureId: string): string | undefined => {
    return ADVENTURE_ILLUSTRATIONS[adventureId];
};

/**
 * Get map image for an adventure by ID
 */
export const getAdventureMapImage = (adventureId: string): string | undefined => {
    return ADVENTURE_MAP_IMAGES[adventureId];
};
