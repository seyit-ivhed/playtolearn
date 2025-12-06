#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '..', 'src', 'locales');

// Keys to keep (actually used in the codebase)
const KEYS_TO_KEEP = new Set([
    'abort_mission',
    'app_title',
    'back_to_home',
    'combat.action.attack',
    'combat.action.attack_tooltip',
    'combat.action.defend',
    'combat.action.defend_tooltip',
    'combat.action.special',
    'combat.action.special_tooltip',
    'combat.defeat.message',
    'combat.defeat.retry',
    'combat.defeat.return',
    'combat.defeat.title',
    'combat.math.recharge_prompt',
    'combat.math.title',
    'combat.victory.collect_rewards',
    'combat.victory.message',
    'combat.victory.title',
    'combat_simulation',
    'empty_slot',
    'loadout.accepts',
    'loadout.allowed_types',
    'loadout.available_modules',
    'loadout.buy',
    'loadout.cancel_selection',
    'loadout.empty_hint',
    'loadout.empty_inventory',
    'loadout.equip',
    'loadout.locked',
    'loadout.select_module',
    'loadout.title',
    'loadout.unequip',
    'math.submit_answer',
    'mission.cancel',
    'mission.no_rewards',
    'mission.rewards',
    'mission.start',
    'mission.target_enemy',
    'mission_select',
    'rewards.credits',
    'rewards.module_unlocked',
    'rewards.next_mission',
    'rewards.none',
    'rewards.return_to_base',
    'rewards.subtitle',
    'rewards.title',
    'rewards.xp',
    'ship.stats.attack',
    'ship.stats.defense',
    'ship.stats.energy',
    'ship.stats.health',
    'ship.stats.speed',
    'ship.status',
    'ship_bay',
    'start_mission',
    'subtitle',
]);

// Swedish translations for missing keys
const SWEDISH_ADDITIONS = {
    'slots.support_system_1': 'Stödsystem 1',
    'slots.support_system_2': 'Stödsystem 2'
};

/**
 * Recursively filter an object to keep only specified keys
 */
function filterKeys(obj, keysToKeep, prefix = '') {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        // Check if this exact key should be kept
        if (keysToKeep.has(fullKey)) {
            result[key] = value;
            continue;
        }

        // Check if any child keys should be kept
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            const hasChildrenToKeep = Array.from(keysToKeep).some(k => k.startsWith(fullKey + '.'));

            if (hasChildrenToKeep) {
                const filtered = filterKeys(value, keysToKeep, fullKey);
                if (Object.keys(filtered).length > 0) {
                    result[key] = filtered;
                }
            }
        }
    }

    return result;
}

/**
 * Set a nested value in an object using dot notation
 */
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;

    for (const key of keys) {
        if (!(key in current)) {
            current[key] = {};
        }
        current = current[key];
    }

    current[lastKey] = value;
}

console.log('=== Translation Cleanup Script ===\n');

// Process English translations
const enPath = path.join(localesDir, 'en.json');
const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));

console.log('Processing English translations...');
const filteredEn = filterKeys(enTranslations, KEYS_TO_KEEP);

// Write cleaned English translations
fs.writeFileSync(enPath, JSON.stringify(filteredEn, null, 4) + '\n', 'utf8');
console.log(`✓ Cleaned en.json: ${Object.keys(enTranslations).length} → ${Object.keys(filteredEn).length} top-level keys\n`);

// Process Swedish translations
const svPath = path.join(localesDir, 'sv.json');
const svTranslations = JSON.parse(fs.readFileSync(svPath, 'utf8'));

console.log('Processing Swedish translations...');
const filteredSv = filterKeys(svTranslations, KEYS_TO_KEEP);

// Add missing Swedish translations
console.log('Adding missing Swedish translations...');
for (const [key, value] of Object.entries(SWEDISH_ADDITIONS)) {
    setNestedValue(filteredSv, key, value);
    console.log(`  + ${key}: "${value}"`);
}

// Write cleaned Swedish translations
fs.writeFileSync(svPath, JSON.stringify(filteredSv, null, 4) + '\n', 'utf8');
console.log(`\n✓ Cleaned sv.json: ${Object.keys(svTranslations).length} → ${Object.keys(filteredSv).length} top-level keys\n`);

console.log('=== Cleanup Complete ===');
console.log('Run "node scripts/check-translations.js" to verify synchronization.');
