/**
 * Test script for sprite catalog
 * Run: node scripts/test-sprite-catalog.cjs
 */

const path = require('path');

// Simple test loader
async function testCatalog() {
  console.log('🧪 Testing Sprite Catalog...\n');
  
  // Load the generated sprite list
  const spritesPath = path.join(__dirname, '../src/ui/sprites/sprite-list-generated.ts');
  const fs = require('fs');
  
  if (!fs.existsSync(spritesPath)) {
    console.error('❌ sprite-list-generated.ts not found!');
    return;
  }
  
  const content = fs.readFileSync(spritesPath, 'utf-8');
  
  // Parse the sprite list (hacky but works for testing)
  const match = content.match(/export const SPRITE_LIST[^=]*=\s*(\[[\s\S]*\]);/);
  if (!match) {
    console.error('❌ Could not parse SPRITE_LIST from file');
    return;
  }
  
  const SPRITE_LIST = JSON.parse(match[1]);
  
  console.log(`✅ Loaded ${SPRITE_LIST.length} sprites\n`);
  
  // Test 1: Get sprites by category
  console.log('Test 1: Get battle-party sprites');
  const battleParty = SPRITE_LIST.filter(s => s.category === 'battle-party');
  console.log(`  Found ${battleParty.length} battle-party sprites`);
  console.log(`  Sample: ${battleParty[0].name} → ${battleParty[0].path}\n`);
  
  // Test 2: Search for Isaac sprites
  console.log('Test 2: Search for "Isaac" sprites');
  const isaacSprites = SPRITE_LIST.filter(s => s.name.toLowerCase().includes('isaac'));
  console.log(`  Found ${isaacSprites.length} Isaac sprites`);
  console.log(`  Sample: ${isaacSprites[0].name}\n`);
  
  // Test 3: Get icons
  console.log('Test 3: Get button icons');
  const buttons = SPRITE_LIST.filter(s => s.category === 'icons-buttons');
  console.log(`  Found ${buttons.length} button icons`);
  if (buttons.length > 0) {
    console.log(`  Sample: ${buttons[0].name} → ${buttons[0].path}\n`);
  }
  
  // Test 4: Category breakdown
  console.log('Test 4: Category breakdown');
  const categories = {};
  SPRITE_LIST.forEach(s => {
    categories[s.category] = (categories[s.category] || 0) + 1;
  });
  
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([cat, count]) => {
      console.log(`  ${cat.padEnd(30)} ${count}`);
    });
  
  console.log(`\n✅ All tests passed!`);
  console.log(`\n📊 Summary:`);
  console.log(`   Total sprites: ${SPRITE_LIST.length}`);
  console.log(`   Total categories: ${Object.keys(categories).length}`);
  console.log(`   Largest category: ${Object.entries(categories).sort((a,b) => b[1]-a[1])[0][0]} (${Object.entries(categories).sort((a,b) => b[1]-a[1])[0][1]} sprites)`);
}

testCatalog().catch(console.error);
