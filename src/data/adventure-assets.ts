/**
 * Adventure Asset Mappings
 * This file maps adventure IDs to their illustrations and map images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

const chapter1Illustration = new URL('../assets/images/chapters/chapter-1.png', import.meta.url).href;
const chapter2Illustration = new URL('../assets/images/chapters/chapter-2.png', import.meta.url).href;
const chapter3Illustration = new URL('../assets/images/chapters/chapter-3.png', import.meta.url).href;
const adventure1Map = new URL('../assets/images/maps/adventure-1.png', import.meta.url).href;
const adventure2Map = new URL('../assets/images/maps/adventure-2.png', import.meta.url).href;
const adventure3Map = new URL('../assets/images/maps/adventure-3.png', import.meta.url).href;

const ADVENTURE_ILLUSTRATIONS: Record<string, string> = {
    '1': chapter1Illustration,
    '2': chapter2Illustration,
    '3': chapter3Illustration,
};

const ADVENTURE_MAP_IMAGES: Record<string, string> = {
    '1': adventure1Map,
    '2': adventure2Map,
    '3': adventure3Map,
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
