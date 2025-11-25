/**
 * Example: Button Component with Proper Spacing
 * Demonstrates the difference between current implementation and improved spacing
 */

import { CSSProperties } from 'react';

// ❌ BEFORE: Current Implementation Issues
export function OldButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        // PROBLEM 1: Too small for mobile (only ~32px height)
        padding: '0.5rem',

        // PROBLEM 2: No minimum height constraint
        // Results in tiny touch target

        // PROBLEM 3: Inconsistent spacing
        marginBottom: '0.25rem',

        // PROBLEM 4: No hover transition
        backgroundColor: '#2a2a2a',
        color: '#fff',
        border: '2px solid #444',
        borderRadius: '0',
        cursor: 'pointer',
        fontSize: '8px', // PROBLEM 5: Too small to read!
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {children}
    </button>
  );
}

// ✅ AFTER: Improved with Proper Spacing
export function ImprovedButton({
  children,
  onClick,
  variant = 'default',
  size = 'md'
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
}) {
  // Size configurations matching our spacing system
  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      minHeight: '40px',  // Desktop minimum
      padding: '8px 16px',
      fontSize: '12px',
    },
    md: {
      minHeight: '48px',  // WCAG AAA standard
      padding: '12px 20px',
      fontSize: '14px',
    },
    lg: {
      minHeight: '56px',  // Primary actions
      padding: '16px 24px',
      fontSize: '16px',
    },
  };

  // Variant styles for visual hierarchy
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: '#2a2a2a',
      color: '#ffffff',
      border: '2px solid #444',
    },
    primary: {
      backgroundColor: '#FFD700',
      color: '#000000',
      border: '2px solid #FFC107',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
    },
    danger: {
      backgroundColor: '#d32f2f',
      color: '#ffffff',
      border: '2px solid #c62828',
    },
    disabled: {
      backgroundColor: '#1a1a1a',
      color: '#666666',
      border: '2px solid #333',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={variant === 'disabled'}
      style={{
        // SOLUTION 1: Proper minimum height for touch targets
        ...sizeStyles[size],

        // SOLUTION 2: Visual hierarchy through variants
        ...variantStyles[variant],

        // SOLUTION 3: Consistent spacing from our system
        marginBottom: '8px', // --spacing-sm

        // SOLUTION 4: Micro-animations for perceived quality
        transition: 'all 100ms ease-out',

        // Common styles
        borderRadius: '4px', // Slight softening
        cursor: variant === 'disabled' ? 'not-allowed' : 'pointer',
        fontFamily: "'Press Start 2P', monospace",

        // Ensure button takes full width in containers
        width: '100%',

        // Better text rendering
        textShadow: variant === 'primary'
          ? '1px 1px 0 rgba(0,0,0,0.2)'
          : '1px 1px 0 #000',
      }}
      // Hover effects via inline styles (for demo purposes)
      onMouseEnter={(e) => {
        if (variant !== 'disabled') {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variantStyles[variant]?.boxShadow || 'none';
      }}
    >
      {children}
    </button>
  );
}

// Example Usage Comparison
export function ButtonComparisonDemo() {
  return (
    <div style={{
      padding: '32px',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      gap: '48px',
    }}>
      {/* Old Implementation */}
      <div style={{ flex: 1 }}>
        <h3 style={{ color: '#fff', marginBottom: '24px' }}>❌ Current Issues</h3>
        <OldButton onClick={() => {}}>
          ATTACK [0○]
        </OldButton>
        <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '16px' }}>
          Problems:
          <ul>
            <li>Only ~32px tall (need 48px)</li>
            <li>8px font (need 14px minimum)</li>
            <li>No hover feedback</li>
            <li>Inconsistent spacing</li>
          </ul>
        </div>
      </div>

      {/* New Implementation */}
      <div style={{ flex: 1 }}>
        <h3 style={{ color: '#fff', marginBottom: '24px' }}>✅ Improved Spacing</h3>

        {/* Small variant */}
        <ImprovedButton onClick={() => {}} size="sm">
          DEFEND [0○]
        </ImprovedButton>

        {/* Medium variant (default) */}
        <ImprovedButton onClick={() => {}} size="md">
          ATTACK [0○]
        </ImprovedButton>

        {/* Large primary */}
        <ImprovedButton onClick={() => {}} size="lg" variant="primary">
          EXECUTE ROUND
        </ImprovedButton>

        {/* Disabled state */}
        <ImprovedButton onClick={() => {}} variant="disabled">
          LOCKED ABILITY [5○]
        </ImprovedButton>

        <div style={{ color: '#51cf66', fontSize: '12px', marginTop: '16px' }}>
          Improvements:
          <ul>
            <li>48px minimum height</li>
            <li>14px readable font</li>
            <li>100ms hover transitions</li>
            <li>8-point grid spacing</li>
            <li>Visual hierarchy via variants</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Key Takeaways:
 *
 * 1. ALWAYS use minHeight for buttons (not just padding)
 * 2. 48px is the magic number for touch targets
 * 3. 100ms transitions feel instant but smooth
 * 4. Visual hierarchy through size AND color
 * 5. Consistent spacing creates rhythm
 * 6. Hover effects are not optional - they're essential
 * 7. Font size minimum: 14px (16px on mobile)
 * 8. Use the 8-point grid religiously
 */
