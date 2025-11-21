/**
 * Button Icon Component
 * Renders UI button sprites (Fight, Psynergy, Djinn, etc.)
 */

import { SimpleSprite } from '../sprites/SimpleSprite';

interface ButtonIconProps {
  /** Button ID (e.g., 'fight', 'psynergy', 'djinn') */
  id: string;
  
  /** Label text */
  label?: string;
  
  /** Size */
  size?: number;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Custom className */
  className?: string;
}

export function ButtonIcon({
  id,
  label,
  size = 32,
  onClick,
  disabled = false,
  className,
}: ButtonIconProps) {
  const spriteId = id.toLowerCase();
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.5rem',
        backgroundColor: disabled ? '#e0e0e0' : '#f5f5f5',
        border: '2px solid',
        borderColor: disabled ? '#bdbdbd' : '#2196F3',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.backgroundColor = '#e3f2fd';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = disabled ? '#e0e0e0' : '#f5f5f5';
      }}
    >
      <SimpleSprite 
        id={spriteId}
        width={size}
        height={size}
      />
      {label && (
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 'bold',
          color: disabled ? '#999' : '#333',
        }}>
          {label}
        </span>
      )}
    </button>
  );
}
