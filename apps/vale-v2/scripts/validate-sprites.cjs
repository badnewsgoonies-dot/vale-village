/**
 * Validate that all sprites in the manifest actually exist
 * Run: node scripts/validate-sprites.cjs
 */

const fs = require('fs');
const path = require('path');

async function validateSprites() {
  console.log('🔍 Validating sprite manifest...\n');
  
  // Load the sprite list
  const spritesPath = path.join(__dirname, '../src/ui/sprites/sprite-list-generated.ts');
  const content = fs.readFileSync(spritesPath, 'utf-8');
  const match = content.match(/export const SPRITE_LIST[^=]*=\s*(\[[\s\S]*\]);/);
  
  if (!match) {
    console.error('❌ Could not parse SPRITE_LIST');
    process.exit(1);
  }
  
  const SPRITE_LIST = JSON.parse(match[1]);
  const publicDir = path.join(__dirname, '../public');
  
  console.log(`Checking ${SPRITE_LIST.length} sprite paths...\n`);
  
  let errors = 0;
  let warnings = 0;
  const missingFiles = [];
  
  SPRITE_LIST.forEach((sprite, index) => {
    const fullPath = path.join(publicDir, sprite.path);
    
    if (!fs.existsSync(fullPath)) {
      errors++;
      missingFiles.push({
        name: sprite.name,
        path: sprite.path,
        category: sprite.category
      });
    }
    
    // Progress indicator
    if ((index + 1) % 100 === 0) {
      process.stdout.write(`\rChecked ${index + 1}/${SPRITE_LIST.length} sprites...`);
    }
  });
  
  console.log(`\rChecked ${SPRITE_LIST.length}/${SPRITE_LIST.length} sprites.   \n`);
  
  if (errors === 0) {
    console.log('✅ All sprites validated successfully!');
    console.log(`   ${SPRITE_LIST.length} sprite paths verified\n`);
    
    // Show summary
    const categories = {};
    SPRITE_LIST.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    
    console.log('📊 Sprite breakdown:');
    Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat.padEnd(30)} ${count}`);
      });
    
    return 0;
  } else {
    console.error(`\n❌ Validation failed!`);
    console.error(`   ${errors} sprite(s) not found\n`);
    
    console.error('Missing sprites:');
    missingFiles.slice(0, 20).forEach(sprite => {
      console.error(`   ❌ ${sprite.name}`);
      console.error(`      Path: ${sprite.path}`);
      console.error(`      Category: ${sprite.category}\n`);
    });
    
    if (missingFiles.length > 20) {
      console.error(`   ... and ${missingFiles.length - 20} more missing files\n`);
    }
    
    return 1;
  }
}

validateSprites()
  .then(code => process.exit(code))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
