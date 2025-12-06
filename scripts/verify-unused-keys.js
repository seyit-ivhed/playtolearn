#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');
const localesDir = path.join(__dirname, '..', 'src', 'locales');

// Recursively find all files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
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

// Find all used translation keys with multiple search patterns
const files = findFiles(srcDir);
const usedKeys = new Set();
const keyUsageMap = new Map(); // Track where each key is used

// Multiple regex patterns to catch different usage styles
const patterns = [
    /t\(['"]([^'"]+)['"]\)/g,                    // t('key')
    /t\(['"]([^'"]+)['"],\s*\{/g,                // t('key', {})
    /\$t\(['"]([^'"]+)['"]\)/g,                  // $t('key') for Vue
    /i18n\.t\(['"]([^'"]+)['"]\)/g,              // i18n.t('key')
    /translate\(['"]([^'"]+)['"]\)/g,            // translate('key')
    /['"]([a-z_]+(?:\.[a-z_]+)+)['"]/g,          // Quoted dotted keys like 'combat.action.attack'
];

// Template literal patterns - these need special handling
const templatePatterns = [
    /t\(`([^`]+)`\)/g,                           // t(`key.${var}`)
    /t\(`([^`]+)`,\s*\{/g,                       // t(`key.${var}`, {})
];

console.log('Scanning files for translation key usage...\n');

// Track template patterns for manual review
const templateUsages = new Map();

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(srcDir, file);

    // Check regular patterns
    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const key = match[1];
            usedKeys.add(key);

            if (!keyUsageMap.has(key)) {
                keyUsageMap.set(key, []);
            }
            keyUsageMap.get(key).push(relativePath);
        }
    }

    // Check template literal patterns
    for (const pattern of templatePatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const template = match[1];
            if (!templateUsages.has(template)) {
                templateUsages.set(template, []);
            }
            templateUsages.get(template).push(relativePath);
        }
    }
}

// Analyze template patterns to infer required keys
console.log('Analyzing template literal patterns...\n');
const dataDir = path.join(srcDir, 'data');

for (const [template, files] of templateUsages) {
    console.log(`Template: t(\`${template}\`)`);
    console.log(`  Used in: ${files.join(', ')}`);

    // Try to infer the pattern (e.g., "slots.${slot.name}" -> need all slots.* keys)
    const match = template.match(/^([a-z_]+)\.(\$\{[^}]+\})\.?(.*)$/);
    if (match) {
        const prefix = match[1];
        const variable = match[2];
        const suffix = match[3];

        console.log(`  Pattern: ${prefix}.* ${suffix ? '.' + suffix : ''}`);
        console.log(`  Action: Check data files for ${prefix} values\n`);
    } else {
        console.log(`  Note: Complex template, manual review needed\n`);
    }
}

// Load translation files
const enPath = path.join(localesDir, 'en.json');
const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const enKeys = extractKeys(enTranslations);

// Find unused keys
const unusedKeys = new Set([...enKeys].filter(k => !usedKeys.has(k)));

console.log('=== DETAILED VERIFICATION REPORT ===\n');
console.log(`Total keys in en.json: ${enKeys.size}`);
console.log(`Total keys found in code: ${usedKeys.size}`);
console.log(`Potentially unused keys: ${unusedKeys.size}\n`);

// Categorize unused keys
const categories = {
    parent: [],      // Parent keys (e.g., 'combat' when 'combat.action.attack' is used)
    leaf: [],        // Actual leaf keys that might be unused
};

for (const key of unusedKeys) {
    // Check if this is a parent key (has children that are used)
    const isParent = [...usedKeys].some(usedKey => usedKey.startsWith(key + '.'));

    if (isParent) {
        categories.parent.push(key);
    } else {
        categories.leaf.push(key);
    }
}

console.log('=== PARENT KEYS (Safe to keep - children are used) ===');
console.log(`Count: ${categories.parent.length}\n`);
categories.parent.sort().forEach(key => {
    const children = [...usedKeys].filter(k => k.startsWith(key + '.')).slice(0, 3);
    console.log(`  ✓ ${key}`);
    console.log(`    Used children: ${children.join(', ')}${children.length < [...usedKeys].filter(k => k.startsWith(key + '.')).length ? '...' : ''}`);
});

console.log('\n=== LEAF KEYS (Potentially unused - candidates for removal) ===');
console.log(`Count: ${categories.leaf.length}\n`);
categories.leaf.sort().forEach(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], enTranslations);
    console.log(`  ✗ ${key}`);
    console.log(`    Value: "${value}"`);
});

// Write detailed report to file
const reportPath = path.join(__dirname, 'unused-keys-report.txt');
const report = [
    '=== UNUSED TRANSLATION KEYS VERIFICATION REPORT ===',
    `Generated: ${new Date().toISOString()}`,
    '',
    `Total keys in en.json: ${enKeys.size}`,
    `Total keys found in code: ${usedKeys.size}`,
    `Potentially unused keys: ${unusedKeys.size}`,
    '',
    '=== KEYS TO KEEP (Parent keys with used children) ===',
    `Count: ${categories.parent.length}`,
    '',
    ...categories.parent.sort().map(key => {
        const children = [...usedKeys].filter(k => k.startsWith(key + '.'));
        return `${key}\n  Used children (${children.length}): ${children.join(', ')}`;
    }),
    '',
    '=== KEYS TO REMOVE (Leaf keys with no usage) ===',
    `Count: ${categories.leaf.length}`,
    '',
    ...categories.leaf.sort().map(key => {
        const value = key.split('.').reduce((obj, k) => obj?.[k], enTranslations);
        return `${key}\n  Value: "${value}"`;
    }),
    '',
    '=== USED KEYS (For reference) ===',
    `Count: ${usedKeys.size}`,
    '',
    ...[...usedKeys].sort().map(key => {
        const files = keyUsageMap.get(key) || [];
        return `${key}\n  Used in: ${files.join(', ')}`;
    }),
];

fs.writeFileSync(reportPath, report.join('\n'), 'utf8');
console.log(`\n✓ Detailed report written to: ${reportPath}`);

// Export for use in cleanup script
export { categories, enTranslations, extractKeys };
