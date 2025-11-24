# Vale Village UI Spacing Recommendations

Based on analysis of 10+ successful RPGs, here are specific improvements for Vale Village's battle UI.

## Critical Changes Needed

### 1. Button Size Fix (HIGHEST PRIORITY)
**Current**: ~32px height buttons
**Required**: 48px minimum for mobile/touch

```tsx
// ❌ Current (too small)
<button style={{ padding: '0.5rem' }}>

// ✅ Improved (proper touch target)
<button style={{
  minHeight: '48px',
  padding: '12px 16px',
  gap: '8px'
}}>
```

### 2. Implement 8-Point Grid System

Replace random spacing values with consistent scale:

```tsx
// ❌ Current (inconsistent)
marginBottom: '0.125rem'  // 2px - too small!
padding: '0.75rem'        // 12px - odd value
gap: '3rem'              // 48px - ok but not systematic

// ✅ Improved (8-point grid)
marginBottom: '8px'      // var(--spacing-sm)
padding: '16px'          // var(--spacing-md)
gap: '48px'             // var(--spacing-2xl)
```

### 3. Information Hierarchy Through Spacing

**Persona 5 Principle**: Use spacing + visual weight to show importance

```tsx
// Critical info (Execute button, current HP)
<div style={{
  padding: '24px',           // More space = more important
  marginTop: '32px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
}}>

// Secondary info (abilities list)
<div style={{
  padding: '16px',
  marginTop: '16px',
}}>

// Tertiary info (status effects)
<div style={{
  padding: '8px',
  marginTop: '8px',
}}>
```

## Specific Component Improvements

### QueueBattleView.tsx Refactor

```tsx
// Top HUD (Mana + Djinn bars)
<div style={{
  padding: '16px 24px',      // Was: 0.75rem (12px) - too tight
  gap: '24px',               // Create breathing room
  marginBottom: '24px',      // Was: 1rem (16px) - needs more separation
}}>

// Unit Cards Container
<div style={{
  gap: '32px',               // Was: 2rem - standardize to grid
  padding: '16px',           // Add container padding
}}>

// Individual Unit Cards
<UnitCard style={{
  minWidth: '280px',         // Prevent cramping
  padding: '16px',           // Consistent internal padding
  gap: '16px',               // Space between elements
}}>

// Ability Buttons (CRITICAL FIX)
<button style={{
  minHeight: '48px',         // Was: ~32px - too small!
  padding: '12px 20px',      // Generous internal padding
  marginBottom: '8px',       // Space between buttons
  fontSize: '14px',          // Was: 8px - too small to read!
  transition: 'all 100ms ease-out',  // Snappy hover
}}>
```

### ActionQueuePanel.tsx Improvements

```tsx
// Queue Items
<div className="queue-item" style={{
  padding: '12px 16px',      // Comfortable padding
  marginBottom: '8px',       // Consistent gap
  borderRadius: '8px',       // Soften edges
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  // Hover lift effect (Hades-inspired)
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }
}}>
```

### UnitCard.tsx Polish

```tsx
// Main Card Container
<div style={{
  padding: '16px',           // Was: 1rem - standardize
  gap: '16px',              // Was: 1rem - standardize
  borderRadius: '8px',      // Consistent with system
  // Subtle hover glow for selected units
  transition: 'box-shadow 200ms ease-out',
  boxShadow: isActive
    ? '0 0 24px rgba(255, 215, 0, 0.3)'  // Golden glow
    : '0 2px 8px rgba(0, 0, 0, 0.2)',
}}>

// HP Bar Container
<div style={{
  height: '16px',           // Was: 12px - slightly larger
  borderRadius: '4px',      // Soften edges
  overflow: 'hidden',
  background: 'rgba(0,0,0,0.3)',  // Deeper backdrop
}}>

// Status Effect Pills
<div className="status-pill" style={{
  padding: '4px 8px',       // Was: cramped
  borderRadius: '12px',     // Pill shape
  gap: '4px',              // Icon spacing
  fontSize: '12px',        // Readable size
}}>
```

## Animation Timing Guidelines

Based on Hades and Slay the Spire success:

```css
/* Hover states - INSTANT feedback */
.button:hover {
  transition: all 100ms ease-out;
  transform: translateY(-1px);
}

/* Selection changes - SMOOTH */
.selected {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1.05);
}

/* Damage numbers - PUNCHY */
@keyframes damage-pop {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1) translateY(-20px); opacity: 0; }
}
.damage { animation: damage-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Victory screen - DRAMATIC */
.victory-overlay {
  animation: slide-up 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Mobile-Specific Adjustments

```tsx
// Media query for touch devices
const isMobile = window.matchMedia('(max-width: 768px)').matches;

const buttonStyle = {
  minHeight: isMobile ? '56px' : '48px',
  padding: isMobile ? '16px 24px' : '12px 20px',
  fontSize: isMobile ? '16px' : '14px',
  // Larger tap areas on mobile
  margin: isMobile ? '12px' : '8px',
};
```

## White Space Strategy (Pokemon Sword/Shield Principle)

Don't fill every pixel. Strategic emptiness emphasizes what matters:

```tsx
// Battle Arena - LET IT BREATHE
<div className="battlefield" style={{
  padding: '48px',          // Generous outer padding
  minHeight: '50vh',        // Don't cram
}}>
  {/* Units have space to "perform" */}
</div>

// Command Deck - FOCUS AREA
<div className="command-deck" style={{
  maxHeight: '40vh',        // Don't dominate screen
  padding: '24px',          // Comfortable internal space
  marginTop: 'auto',        // Push to bottom, create gap
}}>
```

## Color-Coded Visual Hierarchy (Persona 5 Technique)

```tsx
// Priority 1 - Bright/Light (Current unit, active ability)
style={{
  color: '#FFD700',
  textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
  fontWeight: 'bold',
}}

// Priority 2 - Normal (Available actions)
style={{
  color: '#FFFFFF',
  opacity: 1,
}}

// Priority 3 - Dimmed (Unavailable, locked)
style={{
  color: '#888888',
  opacity: 0.5,
}}
```

## Implementation Priority

1. **IMMEDIATE** (Do today):
   - Fix button sizes to 48px minimum
   - Implement CSS variables from spacing-system.css
   - Add 100ms hover transitions

2. **HIGH** (This week):
   - Refactor all components to use 8-point grid
   - Add proper container padding (16-24px)
   - Implement visual hierarchy through spacing

3. **NICE TO HAVE** (Later):
   - Micro-animations (hover lifts, glows)
   - Responsive spacing adjustments
   - Custom animation curves

## Testing Checklist

- [ ] All buttons are 48x48px minimum
- [ ] 8px minimum between interactive elements
- [ ] Text is 14px minimum (16px on mobile)
- [ ] Container padding is consistent (16px or 24px)
- [ ] Hover states respond in <150ms
- [ ] Visual hierarchy clear through spacing
- [ ] Mobile touch targets are 56x56px
- [ ] No spacing values outside the 8-point grid

## Quick Reference

```javascript
// Copy-paste spacing values
const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

const BUTTON_SIZES = {
  sm: '40px',  // Desktop only
  md: '44px',  // Minimum
  lg: '48px',  // Recommended
  xl: '56px',  // Primary actions
};

const TRANSITIONS = {
  instant: '50ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  dramatic: '500ms',
};
```