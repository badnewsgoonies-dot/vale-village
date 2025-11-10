/**
 * ESLint rule: kebab-ability-ids
 * 
 * Enforces kebab-case for ability IDs in:
 * - Ability definition `id:` properties
 * - ABILITIES Record keys
 * - Equipment `unlocksAbility` properties
 * 
 * Only applies to files matching **/data/**/abilities*.ts or **/data/**/equipment*.ts
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce kebab-case for ability IDs',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      mustBeKebabCase: 'Ability ID must be kebab-case (use hyphens, not underscores): "{{value}}" → "{{suggested}}"',
    },
  },
  create(context) {
    const filename = context.getFilename();
    
    // Only check in data definition files
    const isDataFile = /(?:data|definitions)[\\/].*\.(abilities?|equipment)\.ts$/i.test(filename);
    
    if (!isDataFile) {
      return {};
    }

    function toKebabCase(str) {
      return str.replace(/_/g, '-');
    }

    function isSnakeCase(str) {
      return /^[a-z0-9_]+$/.test(str) && str.includes('_');
    }

    function report(node, value) {
      const suggested = toKebabCase(value);
      context.report({
        node,
        messageId: 'mustBeKebabCase',
        data: {
          value,
          suggested,
        },
        fix(fixer) {
          return fixer.replaceText(node, `'${suggested}'`);
        },
      });
    }

    return {
      // Check `id:` properties in ability definitions
      Property(node) {
        if (node.key && (node.key.name === 'id' || node.key.name === 'abilityId')) {
          if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
            const value = node.value.value;
            if (isSnakeCase(value)) {
              report(node.value, value);
            }
          }
        }

        // Check `unlocksAbility` properties in equipment
        if (node.key && node.key.name === 'unlocksAbility') {
          if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
            const value = node.value.value;
            if (isSnakeCase(value)) {
              report(node.value, value);
            }
          }
        }
      },

      // Check ABILITIES Record keys (both quoted and unquoted)
      'Property[key.type="Identifier"]'(node) {
        // Check if parent is ABILITIES variable declaration
        let parent = node.parent;
        while (parent) {
          if (parent.type === 'VariableDeclarator' && parent.id.name === 'ABILITIES') {
            const key = node.key.name;
            if (isSnakeCase(key)) {
              report(node.key, key);
            }
            break;
          }
          parent = parent.parent;
        }
      },

      'Property[key.type="Literal"]'(node) {
        // Check if parent is ABILITIES variable declaration
        let parent = node.parent;
        while (parent) {
          if (parent.type === 'VariableDeclarator' && parent.id.name === 'ABILITIES') {
            if (node.key && typeof node.key.value === 'string') {
              const key = node.key.value;
              if (isSnakeCase(key)) {
                report(node.key, key);
              }
            }
            break;
          }
          parent = parent.parent;
        }
      },
    };
  },
};

