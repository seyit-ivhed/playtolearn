#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');

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

console.log('Used translation keys:');
const sortedKeys = Array.from(usedKeys).sort();
sortedKeys.forEach(key => console.log(`  - ${key}`));
console.log(`\nTotal: ${usedKeys.size} keys`);

// Export for use in other scripts
export { usedKeys };
