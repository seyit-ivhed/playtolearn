#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');
const localesDir = path.join(__dirname, '..', 'src', 'locales');

// Recursively find all TypeScript and TSX files
function findFiles(dir, extensions = ['.ts', '.tsx']) {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            results.push(...findFiles(fullPath, extensions));
        } else if (extensions.some(ext => item.name.endsWith(ext))) {
            results.push(fullPath);
        }
    }

    return results;
}

// Recursively extract all keys from a nested object
function extractKeys(obj, prefix = '') {
    const keys = new Set();

    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.add(fullKey);

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            const nestedKeys = extractKeys(value, fullKey);
            nestedKeys.forEach(k => keys.add(k));
        }
    }

    return keys;
}

// Find all used translation keys in the codebase
const files = findFiles(srcDir);
const usedKeys = new Set();

// Regex patterns to match t('key') and t("key")
const patterns = [
    /t\(['"]([^'"]+)['"]\)/g,
    /t\(['"]([^'"]+)['"],\s*\{/g, // with interpolation
];

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            usedKeys.add(match[1]);
        }
    }
}

// Load translation files
const enPath = path.join(localesDir, 'en.json');
const svPath = path.join(localesDir, 'sv.json');

const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const svTranslations = JSON.parse(fs.readFileSync(svPath, 'utf8'));

const enKeys = extractKeys(enTranslations);
const svKeys = extractKeys(svTranslations);

// Analysis
console.log('=== Translation Analysis ===\n');

console.log(`Total keys in en.json: ${enKeys.size}`);
console.log(`Total keys in sv.json: ${svKeys.size}`);
console.log(`Total keys used in code: ${usedKeys.size}\n`);

// Keys in English but not in Swedish
const missingInSwedish = new Set([...enKeys].filter(k => !svKeys.has(k)));
if (missingInSwedish.size > 0) {
    console.log(`Keys missing in Swedish (${missingInSwedish.size}):`);
    [...missingInSwedish].sort().forEach(key => console.log(`  - ${key}`));
    console.log('');
}

// Keys in Swedish but not in English
const missingInEnglish = new Set([...svKeys].filter(k => !enKeys.has(k)));
if (missingInEnglish.size > 0) {
    console.log(`Keys missing in English (${missingInEnglish.size}):`);
    [...missingInEnglish].sort().forEach(key => console.log(`  - ${key}`));
    console.log('');
}

// Unused keys in English
const unusedInEnglish = new Set([...enKeys].filter(k => !usedKeys.has(k)));
if (unusedInEnglish.size > 0) {
    console.log(`Unused keys in English (${unusedInEnglish.size}):`);
    [...unusedInEnglish].sort().forEach(key => console.log(`  - ${key}`));
    console.log('');
}

// Unused keys in Swedish
const unusedInSwedish = new Set([...svKeys].filter(k => !usedKeys.has(k)));
if (unusedInSwedish.size > 0) {
    console.log(`Unused keys in Swedish (${unusedInSwedish.size}):`);
    [...unusedInSwedish].sort().forEach(key => console.log(`  - ${key}`));
    console.log('');
}

// Keys used in code but missing in translations
const missingInBoth = new Set([...usedKeys].filter(k => !enKeys.has(k) && !svKeys.has(k)));
if (missingInBoth.size > 0) {
    console.log(`Keys used in code but missing in both translations (${missingInBoth.size}):`);
    [...missingInBoth].sort().forEach(key => console.log(`  - ${key}`));
    console.log('');
}

// Summary
console.log('=== Summary ===');
console.log(`✓ Keys properly defined and used: ${usedKeys.size - missingInBoth.size}`);
console.log(`⚠ Unused keys in translations: ${unusedInEnglish.size}`);
console.log(`✗ Missing in Swedish: ${missingInSwedish.size}`);
console.log(`✗ Missing in both: ${missingInBoth.size}`);
