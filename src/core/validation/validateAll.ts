/**
 * Validates all game data at startup
 * Should be called before game starts
 */
import { AbilitySchema } from '../../data/schemas/AbilitySchema';
import { EquipmentSchema } from '../../data/schemas/EquipmentSchema';
import { UnitDefinitionSchema } from '../../data/schemas/UnitSchema';
import { EnemySchema } from '../../data/schemas/EnemySchema';
import { ShopSchema } from '../../data/schemas/ShopSchema';
import { StarterKitSchema } from '../../data/schemas/StarterKitSchema';
import { StoryFlagToUnitSchema, StoryFlagToDjinnSchema } from '../../data/schemas/StoryFlagsSchema';
import { EncounterToRecruitmentDialogueSchema } from '../../data/schemas/RecruitmentDataSchema';
import { ABILITIES } from '../../data/definitions/abilities';
import { EQUIPMENT } from '../../data/definitions/equipment';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';
import { ENEMIES } from '../../data/definitions/enemies';
import { SHOPS } from '../../data/definitions/shops';
import { STARTER_KITS } from '../../data/definitions/starterKits';
import { STORY_FLAG_TO_UNIT, STORY_FLAG_TO_DJINN } from '../../data/definitions/storyFlags';
import { ENCOUNTER_TO_RECRUITMENT_DIALOGUE } from '../../data/definitions/recruitmentData';
import { validateContentBalance, formatBalanceWarnings } from './balanceValidation';

export function validateAllGameData(): void {
  const errors: string[] = [];
  
  // Validate abilities
  Object.entries(ABILITIES).forEach(([id, ability]) => {
    const result = AbilitySchema.safeParse(ability);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Ability ${id}: ${errorMessages}`);
    }
  });
  
  // Validate equipment
  Object.entries(EQUIPMENT).forEach(([id, equipment]) => {
    const result = EquipmentSchema.safeParse(equipment);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Equipment ${id}: ${errorMessages}`);
    }
  });
  
  // Validate unit definitions
  Object.entries(UNIT_DEFINITIONS).forEach(([id, unit]) => {
    const result = UnitDefinitionSchema.safeParse(unit);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Unit ${id}: ${errorMessages}`);
    }
  });
  
  // Validate enemies
  Object.entries(ENEMIES).forEach(([id, enemy]) => {
    const result = EnemySchema.safeParse(enemy);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e =>
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Enemy ${id}: ${errorMessages}`);
    }
  });

  // Validate shops
  Object.entries(SHOPS).forEach(([id, shop]) => {
    // Note: ShopSchema doesn't validate unlockCondition functions
    const shopData = { ...shop };
    delete (shopData as any).unlockCondition; // Remove function for validation
    const result = ShopSchema.safeParse(shopData);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e =>
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Shop ${id}: ${errorMessages}`);
    }
  });

  // Validate starter kits
  Object.entries(STARTER_KITS).forEach(([element, kit]) => {
    const result = StarterKitSchema.safeParse(kit);
    if (!result.success) {
      const errorMessages = result.error.errors.map(e =>
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      errors.push(`Starter Kit ${element}: ${errorMessages}`);
    }
  });

  // Validate story flag mappings
  const storyFlagUnitResult = StoryFlagToUnitSchema.safeParse(STORY_FLAG_TO_UNIT);
  if (!storyFlagUnitResult.success) {
    const errorMessages = storyFlagUnitResult.error.errors.map(e =>
      `${e.path.join('.')}: ${e.message}`
    ).join(', ');
    errors.push(`Story Flag to Unit mapping: ${errorMessages}`);
  }

  const storyFlagDjinnResult = StoryFlagToDjinnSchema.safeParse(STORY_FLAG_TO_DJINN);
  if (!storyFlagDjinnResult.success) {
    const errorMessages = storyFlagDjinnResult.error.errors.map(e =>
      `${e.path.join('.')}: ${e.message}`
    ).join(', ');
    errors.push(`Story Flag to Djinn mapping: ${errorMessages}`);
  }

  // Validate encounter to recruitment dialogue mapping
  const encounterRecruitResult = EncounterToRecruitmentDialogueSchema.safeParse(ENCOUNTER_TO_RECRUITMENT_DIALOGUE);
  if (!encounterRecruitResult.success) {
    const errorMessages = encounterRecruitResult.error.errors.map(e =>
      `${e.path.join('.')}: ${e.message}`
    ).join(', ');
    errors.push(`Encounter to Recruitment Dialogue mapping: ${errorMessages}`);
  }
  
  // Cross-reference checks
  // Check ability unlock levels (1-20)
  Object.entries(ABILITIES).forEach(([id, ability]) => {
    if (ability.unlockLevel < 1 || ability.unlockLevel > 20) {
      errors.push(`Ability ${id}: unlockLevel out of range (1..20)`);
    }
  });
  
  // Check unit abilities exist
  Object.entries(UNIT_DEFINITIONS).forEach(([id, unit]) => {
    for (const ability of unit.abilities) {
      if (!ABILITIES[ability.id]) {
        errors.push(`Unit ${id}: unknown ability id "${ability.id}"`);
      }
    }
  });
  
  // Check enemy abilities exist
  Object.entries(ENEMIES).forEach(([id, enemy]) => {
    for (const ability of enemy.abilities) {
      if (!ABILITIES[ability.id]) {
        errors.push(`Enemy ${id}: unknown ability id "${ability.id}"`);
      }
    }
    // Check enemy drop equipment is valid
    if (enemy.drops) {
      for (const d of enemy.drops) {
        const r = EquipmentSchema.safeParse(d.equipment);
        if (!r.success) {
          const errorMessages = r.error.errors.map(e => 
            `${e.path.join('.')}: ${e.message}`
          ).join(', ');
          errors.push(`Enemy ${id}: invalid drop equipment: ${errorMessages}`);
        }
      }
    }
  });

  // Check equipment unlocksAbility references exist
  Object.entries(EQUIPMENT).forEach(([id, equipment]) => {
    if (equipment.unlocksAbility) {
      if (!ABILITIES[equipment.unlocksAbility]) {
        errors.push(`Equipment ${id}: unlocksAbility "${equipment.unlocksAbility}" does not exist in ABILITIES`);
      }
    }
  });
  
  if (errors.length > 0) {
    throw new Error(`Data validation failed:\n${errors.join('\n')}`);
  }

  // Use console.warn instead of console.log (allowed in validation)
  console.warn('✅ All game data validated successfully');

  // Validate content balance (warnings, not errors)
  const balanceWarnings = validateContentBalance({
    enemies: ENEMIES,
    abilities: ABILITIES,
    equipment: EQUIPMENT,
  });

  if (balanceWarnings.length > 0) {
    console.warn('⚠️  Balance warnings detected:');
    console.warn(formatBalanceWarnings(balanceWarnings));
  } else {
    console.warn('✅ No balance issues detected');
  }
}

