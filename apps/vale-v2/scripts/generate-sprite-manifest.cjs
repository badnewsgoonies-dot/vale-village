const fs = require('fs');
const path = require('path');

// Vale-v2 sprite categories mapped to directory structure
const categories = {
    // Battle sprites
    'battle-party': ['isaac', 'garet', 'ivan', 'mia', 'felix', 'jenna', 'sheba', 'piers', 'kraden', 'kyle'],
    'battle-enemies': ['.'],
    'battle-bosses': ['.'],
    'battle-djinn': ['.'],
    'battle-summons': ['.'],
    'battle-antagonists': ['.'],
    
    // Backgrounds
    'backgrounds-gs1': ['.'],
    'backgrounds-gs2': ['.'],
    
    // Overworld sprites
    'overworld-protagonists': ['.'],
    'overworld-majornpcs': ['.'],
    'overworld-minornpcs': ['.'],
    'overworld-minornpcs2': ['.'],
    'overworld-enemies': ['.'],
    'overworld-djinn': ['.'],
    'overworld-locations': ['.'],
    'overworld-ship': ['.'],
    'overworld-psynergy': ['.'],
    'overworld-antagonists': ['.'],
    
    // Icons
    'icons-buttons': ['.'],
    'icons-characters': ['.'],
    'icons-items': ['.'],
    'icons-psynergy': ['.'],
    'icons-misc': ['.'],
    
    // Psynergy effects
    'psynergy': ['.'],
    
    // Scenery
    'scenery-buildings': ['.'],
    'scenery-indoor': ['.'],
    'scenery-outdoor': ['.'],
    'scenery-plants': ['.'],
    'scenery-statues': ['.'],
    
    // Text
    'text': ['.']
};

// Map category names to actual folder paths in vale-v2
const categoryPaths = {
    'battle-party': 'battle/party',
    'battle-enemies': 'battle/enemies',
    'battle-bosses': 'battle/bosses',
    'battle-djinn': 'battle/djinn',
    'battle-summons': 'battle/summons',
    'battle-antagonists': 'battle/antagonists',
    'backgrounds-gs1': 'backgrounds/gs1',
    'backgrounds-gs2': 'backgrounds/gs2',
    'overworld-protagonists': 'overworld/protagonists',
    'overworld-majornpcs': 'overworld/majornpcs',
    'overworld-minornpcs': 'overworld/minornpcs',
    'overworld-minornpcs2': 'overworld/minornpcs_2',
    'overworld-enemies': 'overworld/enemies',
    'overworld-djinn': 'overworld/djinn',
    'overworld-locations': 'overworld/locations',
    'overworld-ship': 'overworld/ship',
    'overworld-psynergy': 'overworld/psynergy',
    'overworld-antagonists': 'overworld/antagonists',
    'icons-buttons': 'icons/buttons',
    'icons-characters': 'icons/characters',
    'icons-items': 'icons/items',
    'icons-psynergy': 'icons/psynergy',
    'icons-misc': 'icons/misc',
    'psynergy': 'psynergy',
    'scenery-buildings': 'scenery/buildings',
    'scenery-indoor': 'scenery/indoor',
    'scenery-outdoor': 'scenery/outdoor',
    'scenery-plants': 'scenery/plants',
    'scenery-statues': 'scenery/statues',
    'text': 'text'
};

const spritesDir = path.join(__dirname, '../public/sprites');
const spriteList = [];

function scanDirectory(category, subdir) {
    const basePath = categoryPaths[category];
    if (!basePath) {
        console.warn(`Warning: No path mapping for category: ${category}`);
        return;
    }

    let fullPath;
    if (subdir === '.') {
        fullPath = path.join(spritesDir, basePath);
    } else {
        fullPath = path.join(spritesDir, basePath, subdir);
    }

    if (!fs.existsSync(fullPath)) {
        console.warn(`Warning: Path does not exist: ${fullPath}`);
        return;
    }

    const files = fs.readdirSync(fullPath);
    files.forEach(file => {
        if (file.endsWith('.gif') || file.endsWith('.png')) {
            const name = file
                .replace('.gif', '')
                .replace('.png', '')
                .replace(/_/g, ' ')
                .replace(/-/g, ' ');

            let relativePath;
            if (subdir === '.') {
                relativePath = `/sprites/${basePath}/${file}`;
            } else {
                relativePath = `/sprites/${basePath}/${subdir}/${file}`;
            }

            spriteList.push({
                name,
                path: relativePath,
                category,
                subcategory: subdir === '.' ? null : subdir
            });
        }
    });
}

// Scan all categories
console.log('Scanning sprite directories...\n');
for (const [category, subdirs] of Object.entries(categories)) {
    subdirs.forEach(subdir => scanDirectory(category, subdir));
}

// Generate TypeScript code
const tsCode = `// Auto-generated sprite list
// Run 'node scripts/generate-sprite-manifest.js' to regenerate
// Generated: ${new Date().toISOString()}

export interface SpriteEntry {
  name: string;
  path: string;
  category: string;
  subcategory: string | null;
}

export const SPRITE_LIST: SpriteEntry[] = ${JSON.stringify(spriteList, null, 2)};

// Total sprites: ${spriteList.length}
`;

const outputPath = path.join(__dirname, '../src/ui/sprites/sprite-list-generated.ts');
fs.writeFileSync(outputPath, tsCode);

console.log(`✅ Generated ${spriteList.length} sprite entries!`);
console.log(`   Output: ${outputPath}\n`);
console.log('Breakdown by category:');

// Get unique categories and count
const categoryCounts = {};
spriteList.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
});

Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
        console.log(`  ${cat.padEnd(30)} ${count}`);
    });

console.log(`\n✅ Total: ${spriteList.length} sprites cataloged`);
