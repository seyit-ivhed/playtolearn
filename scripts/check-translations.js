#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

/**
 * Recursively extract all keys from a nested object
 * @param {Object} obj - The object to extract keys from
 * @param {string} prefix - Current key path prefix
 * @returns {Set<string>} Set of all key paths
 */
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

/**
 * Compare two sets and return differences
 * @param {Set} set1 - First set
 * @param {Set} set2 - Second set
 * @returns {Object} Object containing keys only in set1 and only in set2
 */
function compareSets(set1, set2) {
    const onlyInSet1 = new Set([...set1].filter(x => !set2.has(x)));
    const onlyInSet2 = new Set([...set2].filter(x => !set1.has(x)));

    return { onlyInSet1, onlyInSet2 };
}

/**
 * Main function to check translation synchronization
 */
function checkTranslations() {
    const localesDir = path.join(__dirname, '..', 'src', 'locales');

    // Check if locales directory exists
    if (!fs.existsSync(localesDir)) {
        console.error(`${colors.red}Error: Locales directory not found at ${localesDir}${colors.reset}`);
        process.exit(1);
    }

    // Read all JSON files from locales directory
    const files = fs.readdirSync(localesDir)
        .filter(file => file.endsWith('.json'))
        .sort();

    if (files.length === 0) {
        console.error(`${colors.red}Error: No translation files found in ${localesDir}${colors.reset}`);
        process.exit(1);
    }

    console.log(`${colors.yellow}Checking translation key synchronization...${colors.reset}\n`);
    console.log(`Found ${files.length} translation file(s): ${files.join(', ')}\n`);

    // Load all translation files and extract keys
    const translations = {};
    const allKeys = {};

    for (const file of files) {
        const filePath = path.join(localesDir, file);
        const locale = path.basename(file, '.json');

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            translations[locale] = JSON.parse(content);
            allKeys[locale] = extractKeys(translations[locale]);
            console.log(`✓ Loaded ${file}: ${allKeys[locale].size} keys`);
        } catch (error) {
            console.error(`${colors.red}Error reading ${file}: ${error.message}${colors.reset}`);
            process.exit(1);
        }
    }

    console.log('');

    // Compare all translation files pairwise
    let hasErrors = false;
    const locales = Object.keys(allKeys);

    for (let i = 0; i < locales.length; i++) {
        for (let j = i + 1; j < locales.length; j++) {
            const locale1 = locales[i];
            const locale2 = locales[j];

            const { onlyInSet1, onlyInSet2 } = compareSets(allKeys[locale1], allKeys[locale2]);

            if (onlyInSet1.size > 0 || onlyInSet2.size > 0) {
                hasErrors = true;
                console.log(`${colors.red}✗ Mismatch between ${locale1}.json and ${locale2}.json${colors.reset}\n`);

                if (onlyInSet1.size > 0) {
                    console.log(`  Keys only in ${locale1}.json (${onlyInSet1.size}):`);
                    [...onlyInSet1].sort().forEach(key => {
                        console.log(`    - ${key}`);
                    });
                    console.log('');
                }

                if (onlyInSet2.size > 0) {
                    console.log(`  Keys only in ${locale2}.json (${onlyInSet2.size}):`);
                    [...onlyInSet2].sort().forEach(key => {
                        console.log(`    - ${key}`);
                    });
                    console.log('');
                }
            } else {
                console.log(`${colors.green}✓ ${locale1}.json and ${locale2}.json are synchronized${colors.reset}`);
            }
        }
    }

    console.log('');

    if (hasErrors) {
        console.log(`${colors.red}Translation check failed! Please synchronize all translation files.${colors.reset}`);
        process.exit(1);
    } else {
        console.log(`${colors.green}All translation files are synchronized! ✓${colors.reset}`);
        process.exit(0);
    }
}

// Run the check
checkTranslations();
