# Enemy Implementation Plan - Vale Chronicles

**Total Enemy Sprites Available:** 173
**Currently Implemented:** 4 (Goblin, Wild_Wolf, Slime, Earth_Golem)
**Remaining to Implement:** 169 enemies

---

## Current Status

### ✅ Already Implemented (4 enemies)
- Goblin (Level 1, Neutral)
- Wild_Wolf (Level 1, Neutral)
- Slime (Level 2, Mercury)
- Earth_Golem (Level 3, Venus)

### ⚠️ Data Exists But No Sprite Match (6 enemies)
These need sprite mapping or removal:
- Fire_Sprite → Could map to: Salamander, Fire_Worm
- Wind_Wisp → Could map to: Willowisp
- Fire_Elemental → Could map to: Phoenix, Red_Demon
- Ice_Guardian → Could map to: Ice_Gargoyle
- Stone_Titan → Could map to: Grand_Golem, Living_Statue
- Storm_Lord → Could map to: Sky_Dragon, Thunder_Lizard

---

## Implementation Batches (169 New Enemies)

### 🟢 BATCH 1: Basic Enemies (20 enemies - Levels 1-2)
**Theme:** Early game wildlife, basic monsters, and weak humanoids

1. **Rat** (Level 1, Neutral) - Fast weak enemy
2. **Bat** (Level 1, Jupiter) - Flying, fast
3. **Spider** (Level 1, Venus) - Web attacks
4. **Grub** (Level 1, Neutral) - Very weak, defensive
5. **Worm** (Level 1, Venus) - Underground enemy
6. **Vermin** (Level 1, Neutral) - Swarm enemy
7. **Mini-Goblin** (Level 1, Neutral) - Weaker goblin
8. **Kobold** (Level 1, Neutral) - Small humanoid
9. **Roach** (Level 1, Neutral) - Fast pest
10. **Momonga** (Level 1, Neutral) - Flying squirrel
11. **Emu** (Level 2, Neutral) - Bird enemy
12. **Seabird** (Level 2, Jupiter) - Coastal bird
13. **Seafowl** (Level 2, Jupiter) - Water bird
14. **Wild_Mushroom** (Level 2, Venus) - Plant enemy
15. **Poison_Toad** (Level 2, Mercury) - Poison attacks
16. **Devil_Frog** (Level 2, Mercury) - Stronger toad
17. **Mole** (Level 2, Venus) - Burrowing enemy
18. **Mad_Mole** (Level 2, Venus) - Aggressive mole
19. **Mad_Vermin** (Level 2, Neutral) - Rabid pest
20. **Squirrelfang** (Level 2, Neutral) - Aggressive rodent

---

### 🟡 BATCH 2: Common Enemies (25 enemies - Levels 2-3)
**Theme:** Stronger wildlife, elementals, and trained monsters

21. **Hobgoblin** (Level 2, Neutral) - Upgraded goblin
22. **Alec_Goblin** (Level 2, Neutral) - Special goblin variant
23. **Dire_Wolf** (Level 3, Neutral) - Stronger wolf
24. **Wolfkin** (Level 3, Neutral) - Wolf humanoid
25. **Wolfkin_Cub** (Level 3, Neutral) - Young wolfkin
26. **Dread_Hound** (Level 3, Mars) - Fire hound
27. **Rabid_Bat** (Level 3, Jupiter) - Diseased bat
28. **Tarantula** (Level 3, Venus) - Large spider
29. **Recluse** (Level 3, Venus) - Poisonous spider
30. **Armored_Rat** (Level 3, Neutral) - Defensive rat
31. **Plated_Rat** (Level 3, Neutral) - Armored variant
32. **Rat_Fighter** (Level 3, Neutral) - Combat rat
33. **Rat_Soldier** (Level 3, Neutral) - Trained rat
34. **Rat_Warrior** (Level 3, Neutral) - Elite rat
35. **Ant_Lion** (Level 3, Venus) - Desert predator
36. **Flash_Ant** (Level 3, Jupiter) - Lightning ant
37. **Numb_Ant** (Level 3, Jupiter) - Paralyze attacks
38. **Punch_Ant** (Level 3, Neutral) - Physical ant
39. **Drone_Bee** (Level 3, Jupiter) - Basic bee
40. **Fighter_Bee** (Level 3, Jupiter) - Combat bee
41. **Warrior_Bee** (Level 3, Jupiter) - Elite bee
42. **Ooze** (Level 3, Mercury) - Liquid enemy
43. **Slime_Beast** (Level 3, Mercury) - Large slime
44. **Salamander** (Level 3, Mars) - Fire lizard
45. **Fire_Worm** (Level 3, Mars) - Flame worm

---

### 🟠 BATCH 3: Intermediate Enemies (25 enemies - Levels 3-4)
**Theme:** Humanoids, magical creatures, and mid-tier monsters

46. **Gnome** (Level 3, Venus) - Earth spirit
47. **Gnome_Mage** (Level 3, Venus) - Spellcaster gnome
48. **Gnome_Wizard** (Level 4, Venus) - Advanced gnome
49. **Pixie** (Level 3, Jupiter) - Wind fairy
50. **Faery** (Level 3, Jupiter) - Magic fairy
51. **Willowisp** (Level 4, Jupiter) - Wind spirit
52. **Ghost** (Level 3, Neutral) - Undead spirit
53. **Spirit** (Level 3, Neutral) - Energy being
54. **Will_Head** (Level 3, Neutral) - Floating head
55. **Horned_Ghost** (Level 4, Neutral) - Demon ghost
56. **Skeleton** (Level 3, Neutral) - Undead warrior
57. **Undead** (Level 3, Neutral) - Zombie
58. **Zombie** (Level 3, Neutral) - Walking dead
59. **Ghoul** (Level 4, Neutral) - Flesh eater
60. **Cannibal_Ghoul** (Level 4, Neutral) - Vicious ghoul
61. **Fiendish_Ghoul** (Level 4, Neutral) - Demon ghoul
62. **Orc** (Level 4, Neutral) - Warrior humanoid
63. **Brigand** (Level 4, Neutral) - Human bandit
64. **Thief** (Level 4, Neutral) - Rogue enemy
65. **Ruffian** (Level 4, Neutral) - Street fighter
66. **Assassin** (Level 4, Neutral) - Fast killer
67. **Earth_Lizard** (Level 4, Venus) - Rock lizard
68. **Lizard_Man** (Level 4, Neutral) - Humanoid lizard
69. **Lizard_Fighter** (Level 4, Neutral) - Combat lizard
70. **Thunder_Lizard** (Level 4, Jupiter) - Electric lizard

---

### 🔴 BATCH 4: Advanced Enemies (25 enemies - Levels 4-5)
**Theme:** Elite warriors, dangerous beasts, and powerful elementals

71. **Tornado_Lizard** (Level 5, Jupiter) - Wind lizard
72. **Lizard_King** (Level 5, Neutral) - Lizard boss
73. **Merman** (Level 4, Mercury) - Aquatic humanoid
74. **Gillman** (Level 4, Mercury) - Fish man
75. **Ape** (Level 4, Neutral) - Strong primate
76. **Wild_Ape** (Level 4, Neutral) - Feral ape
77. **Dirty_Ape** (Level 4, Neutral) - Disease ape
78. **Grizzly** (Level 5, Neutral) - Bear enemy
79. **Creeper** (Level 4, Venus) - Vine monster
80. **Wood_Walker** (Level 4, Venus) - Tree creature
81. **Mad_Plant** (Level 4, Venus) - Carnivorous plant
82. **Dino** (Level 5, Neutral) - Small dinosaur
83. **Dinox** (Level 5, Neutral) - Large dinosaur
84. **Raptor** (Level 5, Neutral) - Fast predator
85. **Talon_Runner** (Level 5, Neutral) - Bird dinosaur
86. **Golem** (Level 5, Venus) - Stone construct
87. **Clay_Gargoyle** (Level 5, Venus) - Earth guardian
88. **Gargoyle** (Level 5, Venus) - Stone guardian
89. **Ice_Gargoyle** (Level 5, Mercury) - Ice guardian
90. **Raging_Rock** (Level 5, Venus) - Angry boulder
91. **Boulder_Beast** (Level 5, Venus) - Rock creature
92. **Living_Statue** (Level 5, Neutral) - Animated stone
93. **Living_Armor** (Level 5, Mars) - Possessed armor
94. **Stone_Soldier** (Level 5, Venus) - Rock warrior
95. **Minos_Warrior** (Level 5, Neutral) - Bull warrior

---

### 🟣 BATCH 5: Elite Enemies (25 enemies - Levels 5-6)
**Theme:** Mythical beasts, demons, and high-tier undead

96. **Minotaurus** (Level 5, Neutral) - Bull beast
97. **Cave_Troll** (Level 5, Neutral) - Underground troll
98. **Troll** (Level 6, Neutral) - Large brute
99. **Brutal_Troll** (Level 6, Neutral) - Savage troll
100. **Orc_Captain** (Level 5, Neutral) - Orc leader
101. **Orc_Lord** (Level 6, Neutral) - Orc commander
102. **Mummy** (Level 5, Neutral) - Wrapped undead
103. **Foul_Mummy** (Level 5, Neutral) - Diseased mummy
104. **Bone_Fighter** (Level 5, Neutral) - Skeleton warrior
105. **Skull_Warrior** (Level 6, Neutral) - Elite skeleton
106. **Wight** (Level 5, Neutral) - Powerful undead
107. **Grave_Wight** (Level 6, Neutral) - Tomb guardian
108. **Death_Head** (Level 6, Neutral) - Flying skull
109. **Little_Death** (Level 6, Neutral) - Reaper minion
110. **Dirge** (Level 5, Neutral) - Mourner ghost
111. **Foul_Dirge** (Level 5, Neutral) - Corrupted dirge
112. **Vile_Dirge** (Level 6, Neutral) - Evil dirge
113. **Harpy** (Level 5, Jupiter) - Bird woman
114. **Harridan** (Level 5, Jupiter) - Old harpy
115. **Virago** (Level 6, Jupiter) - Warrior harpy
116. **Siren** (Level 6, Mercury) - Sea enchantress
117. **Gryphon** (Level 6, Jupiter) - Lion eagle
118. **Wild_Gryphon** (Level 6, Jupiter) - Feral gryphon
119. **Wise_Gryphon** (Level 6, Jupiter) - Magic gryphon
120. **Wyvern** (Level 6, Mars) - Dragon kin

---

### ⚫ BATCH 6: High-Level Enemies (25 enemies - Levels 6-8)
**Theme:** Dragons, demons, and legendary monsters

121. **Wyvern_Chick** (Level 6, Mars) - Young wyvern
122. **Pteranodon** (Level 6, Jupiter) - Flying reptile
123. **Roc** (Level 7, Jupiter) - Giant bird
124. **Wonder_Bird** (Level 7, Jupiter) - Magical bird
125. **Phoenix** (Level 8, Mars) - Fire bird
126. **Manticore_King** (Level 7, Neutral) - Beast ruler
127. **Chimera** (Level 7, Neutral) - Multi-beast
128. **Chimera_Mage** (Level 7, Neutral) - Magic chimera
129. **Chimera_Worm** (Level 7, Neutral) - Worm chimera
130. **Grand_Chimera** (Level 8, Neutral) - Ultimate chimera
131. **Magicore** (Level 7, Mars) - Magic beast
132. **Cerebus** (Level 7, Mars) - Three-headed dog
133. **Fenrir** (Level 8, Jupiter) - Wolf demon
134. **Hydra** (Level 7, Mercury) - Multi-headed serpent
135. **Sky_Dragon** (Level 7, Jupiter) - Wind dragon
136. **Turtle_Dragon** (Level 7, Mercury) - Sea dragon
137. **Cruel_Dragon** (Level 8, Mars) - Fire dragon
138. **Druj** (Level 7, Neutral) - Demon
139. **Red_Demon** (Level 7, Mars) - Fire demon
140. **Mad_Demon** (Level 8, Mars) - Insane demon
141. **Succubus** (Level 7, Neutral) - Seductress demon
142. **Nightmare** (Level 7, Neutral) - Dream demon
143. **Ghost_Mage** (Level 7, Neutral) - Undead wizard
144. **Ghost_Army** (Level 7, Neutral) - Legion spirit
145. **Doomsayer** (Level 8, Neutral) - Prophet of doom

---

### 🔥 BATCH 7: Late-Game Enemies (24 enemies - Levels 8-10)
**Theme:** Ancient horrors, titans, and endgame threats

146. **Lich** (Level 8, Neutral) - Undead wizard
147. **Lich_2** (Level 9, Neutral) - Greater lich
148. **Grand_Golem** (Level 8, Venus) - Massive golem
149. **Wargold** (Level 8, Mars) - War machine
150. **Mauler** (Level 8, Neutral) - Brutal warrior
151. **Ravager** (Level 8, Neutral) - Destroyer
152. **Slayer** (Level 9, Neutral) - Master killer
153. **Mimic** (Level 8, Neutral) - Shapeshifter
154. **Amaze** (Level 8, Jupiter) - Illusion beast
155. **Death_Cap** (Level 8, Venus) - Deadly mushroom
156. **Doodle_Bug** (Level 8, Venus) - Chaos insect
157. **Needle_Egg** (Level 8, Neutral) - Spike creature
158. **Acid_Maggot** (Level 8, Venus) - Corrosive worm
159. **Angle_Worm** (Level 8, Neutral) - Geometric horror
160. **Bombander** (Level 9, Mars) - Explosive salamander
161. **Calamar** (Level 9, Mercury) - Giant squid
162. **Cuttle** (Level 9, Mercury) - Cuttlefish
163. **Man_o_War** (Level 9, Mercury) - Jellyfish
164. **Spiral_Shell** (Level 9, Mercury) - Shell monster
165. **Urchin_Beast** (Level 9, Mercury) - Spiny creature
166. **Macetail** (Level 9, Neutral) - Tail weapon beast
167. **Kobold_2** (Level 9, Neutral) - Elite kobold
168. **Devil_Scorpion** (Level 9, Mars) - Demon scorpion
169. **Death_Cap** (Level 10, Venus) - Ultimate fungus

---

## Implementation Checklist

### Per Enemy Implementation Steps:
- [ ] Choose element (Venus/Mars/Mercury/Jupiter/Neutral)
- [ ] Set level and stats (HP, PP, ATK, DEF, MAG, SPD)
- [ ] Assign 1-3 abilities from ability pool
- [ ] Calculate baseXp (50 + level*10)
- [ ] Calculate baseGold (25 + level*15)
- [ ] Optional: Add equipment drops (5-25% chance)
- [ ] Verify sprite file exists in `/public/sprites/battle/enemies/`
- [ ] Test in battle encounter

### Stat Guidelines by Level:
- **Level 1-2:** HP: 25-45, ATK/DEF: 6-12, MAG: 2-10, SPD: 6-12
- **Level 3-4:** HP: 50-100, ATK/DEF: 10-18, MAG: 8-18, SPD: 8-18
- **Level 5-6:** HP: 120-180, ATK/DEF: 15-25, MAG: 12-25, SPD: 10-22
- **Level 7-8:** HP: 200-300, ATK/DEF: 22-35, MAG: 20-35, SPD: 15-28
- **Level 9-10:** HP: 350-500, ATK/DEF: 30-45, MAG: 28-45, SPD: 20-35

---

## Progress Tracking

- ✅ **Batch 1:** 0/20 completed
- ⬜ **Batch 2:** 0/25 completed
- ⬜ **Batch 3:** 0/25 completed
- ⬜ **Batch 4:** 0/25 completed
- ⬜ **Batch 5:** 0/25 completed
- ⬜ **Batch 6:** 0/25 completed
- ⬜ **Batch 7:** 0/24 completed

**Total Progress:** 0/169 (0%)

---

## Notes

- Some enemies are variants (Rat, Rat_Fighter, Rat_Soldier, Rat_Warrior) - these should have progressive stats
- Element types should match sprite visual themes (fire = Mars, ice = Mercury, earth = Venus, wind = Jupiter)
- Boss-tier enemies (Kings, Lords, Ancient) should have higher stats and more abilities
- Equipment drop chances scale with level: 5-10% (low), 10-18% (mid), 18-25% (high)
