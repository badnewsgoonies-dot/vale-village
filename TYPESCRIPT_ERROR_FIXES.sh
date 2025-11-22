#!/bin/bash

# Fix recruitment dialogues TypeScript errors

# Fix house1Post - War Mage with Forge Djinn
sed -i 's/recruitUnit: true,/recruitUnit: "war-mage",/' src/data/definitions/recruitmentDialogues.ts
sed -i '0,/grantDjinn: true,/s//grantDjinn: "forge",/' src/data/definitions/recruitmentDialogues.ts

# Fix house5Post - Mystic
sed -i '0,/effects: { recruitUnit: true }/s//effects: { recruitUnit: "mystic" }/' src/data/definitions/recruitmentDialogues.ts

# Fix house8Post - Ranger  
sed -i '0,/effects: { recruitUnit: true }/s//effects: { recruitUnit: "ranger" }/' src/data/definitions/recruitmentDialogues.ts

# Fix house8Post - Blaze
sed -i '0,/effects: { recruitUnit: true }/s//effects: { recruitUnit: "blaze" }/' src/data/definitions/recruitmentDialogues.ts

# Fix house11Post - Sentinel with Fizz Djinn
sed -i '0,/recruitUnit: true,/s//recruitUnit: "sentinel",/' src/data/definitions/recruitmentDialogues.ts
sed -i '0,/grantDjinn: true,/s//grantDjinn: "fizz",/' src/data/definitions/recruitmentDialogues.ts

# Fix house14Post - Karis
sed -i '0,/effects: { recruitUnit: true }/s//effects: { recruitUnit: "karis" }/' src/data/definitions/recruitmentDialogues.ts

# Fix house15Post - Tyrell
sed -i '0,/effects: { recruitUnit: true }/s//effects: { recruitUnit: "tyrell" }/' src/data/definitions/recruitmentDialogues.ts

# Fix house17Post - Stormcaller with Squall Djinn
sed -i '0,/recruitUnit: true,/s//recruitUnit: "stormcaller",/' src/data/definitions/recruitmentDialogues.ts
sed -i '0,/grantDjinn: true,/s//grantDjinn: "squall",/' src/data/definitions/recruitmentDialogues.ts

# Fix house20Post - Felix
sed -i '0,/effects: { recruitUnit: true }/s//effects: { recruitUnit: "felix" }/' src/data/definitions/recruitmentDialogues.ts

echo "Recruitment dialogue fixes applied"