# How to View the Companion Sprites Mockup

You have **3 ways** to view the companion sprites mockup. The easiest is using ChatGPT!

---

## ⭐ Recommended: ChatGPT Canvas (Best for Viewing)

ChatGPT can render HTML and show you screenshots! Here's what to do:

### Step 1: Copy the HTML File
The mockup is located at:
```
/workspace/mockups/improved/overworld-companion-sprites.html
```

### Step 2: Paste this Prompt into ChatGPT

```
I have an HTML mockup demonstrating companion sprite movement in a Golden Sun-style 
RPG overworld. Can you display this HTML and show me what it looks like?

The mockup shows:
- A player character (leader) at the front
- 3 companion characters following in a line
- Each companion trails behind with smooth transitions
- Interactive controls to move the party

Please:
1. Render the HTML and take a screenshot
2. Describe the visual layout you see
3. Test the movement buttons if possible
4. Suggest any improvements to the design

Here's the HTML:

[Paste the entire contents of overworld-companion-sprites.html here]
```

### Step 3: View the Results
ChatGPT will:
- ✅ Render the HTML in Canvas
- ✅ Show you a visual screenshot
- ✅ Describe what's working
- ✅ Suggest improvements

---

## Option 2: Open Directly in Browser

If you have access to the file system:

1. **Navigate to the mockup:**
   ```
   /workspace/mockups/improved/overworld-companion-sprites.html
   ```

2. **Open in your browser:**
   - Double-click the file, OR
   - Right-click → Open With → Chrome/Firefox/Safari

3. **Interact with it:**
   - Click the arrow buttons at the bottom
   - OR use arrow keys (↑↓←→) on your keyboard
   - Watch the party members follow the leader!

**What you'll see:**
- 960×640px game viewport (GBA resolution scaled 4x)
- Grass terrain with tiled pattern
- Dirt path down the center
- 4 character sprites: Isaac (🧙‍♂️), Garet (⚔️), Ivan (🏹), Mia (🔮)
- Each character has a drop shadow
- Smooth animations when moving
- Info panel explaining the pattern

---

## Option 3: Local Web Server

For the most authentic experience:

```bash
# Navigate to mockups directory
cd /workspace/mockups/improved

# Start a simple HTTP server
python3 -m http.server 8000

# Open in browser
# http://localhost:8000/overworld-companion-sprites.html
```

This ensures CSS/fonts load correctly (especially the Press Start 2P pixel font from Google Fonts).

---

## What the Mockup Demonstrates

### Visual Features
1. **Follow-the-Leader Pattern**
   - Isaac (leader) moves first
   - Garet follows Isaac's previous position
   - Ivan follows Garet's previous position
   - Mia follows Ivan's previous position

2. **Smooth Transitions**
   - CSS cubic-bezier easing for fluid movement
   - Staggered animation timing (0.2s, 0.4s, 0.6s delays)
   - Subtle bobbing animation on each character

3. **Authentic GBA Aesthetic**
   - 960×640 viewport (240×160 @4x scaling)
   - Tiled grass background
   - Drop shadows for entity grounding
   - Press Start 2P pixel font
   - Golden Sun color palette

### Interactive Controls
- **Arrow Buttons**: Click to move party up/down/left/right
- **Keyboard**: Use ↑↓←→ or WASD keys
- **Movement**: Party moves in formation, 50px per step
- **Bounds**: Characters stay within the viewport

### Technical Info Panel
The right side shows:
- How the pattern works
- Implementation details
- Position tracking approach
- 8-direction support notes

---

## Expected Behavior

When you click an arrow button or press a direction key:

1. **Isaac (leader)** moves immediately in that direction
2. **Garet** moves to Isaac's old position after 150ms
3. **Ivan** moves to Garet's old position after 300ms
4. **Mia** moves to Ivan's old position after 450ms

This creates a smooth "snake-like" following pattern, exactly like Golden Sun!

---

## Troubleshooting

### Fonts not loading?
- Make sure you have internet connection (Google Fonts CDN)
- Or view via local server (Option 3)

### Characters not moving?
- Check browser console for JavaScript errors
- Try using keyboard arrows instead of buttons

### Page looks broken?
- Ensure `../tokens.css` exists at `/workspace/mockups/tokens.css`
- Check that you're viewing the file from the correct directory

---

## Next: Getting Real Sprites

The mockup currently uses emoji placeholders (🧙‍♂️⚔️🏹🔮). 

**Real Golden Sun sprites are available at:**
```
/workspace/mockups/improved/sprites/overworld/
```

Includes animated GIFs for:
- Isaac_Walk.gif, Isaac_Walk_Up.gif, etc.
- Garet_Left.gif, Garet_Right.gif, etc.
- Ivan, Mia, Felix, Jenna, Sheba, Piers

To use real sprites, replace the emoji with:
```html
<img src="sprites/overworld/Isaac.gif" class="entity-sprite" />
```

---

## Sharing Your Mockup

### To get feedback:
1. Open the mockup in browser
2. Take a screenshot
3. Share with your team/ChatGPT
4. Ask: "Does this match Golden Sun's companion behavior?"

### To iterate:
1. Edit `overworld-companion-sprites.html` directly
2. Adjust CSS values (spacing, timing, colors)
3. Refresh browser to see changes
4. No build step required!

---

## Summary

✅ **Easiest Method**: Copy HTML → Paste into ChatGPT → View screenshot  
✅ **Direct Method**: Double-click HTML file → Opens in browser  
✅ **Pro Method**: Run local server → View with proper fonts  

**The mockup is interactive!** Move the party around to see the follow-the-leader pattern in action.

Need help viewing it? Try the ChatGPT prompt above - it works great for HTML mockups!
