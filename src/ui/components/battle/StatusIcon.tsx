/**
 * StatusIcon Component
 * Displays status effect icons using sprite assets
 */

import { SimpleSprite } from '../../sprites/SimpleSprite';
import { getStatusIconSprite } from '../../sprites/mappings';

interface StatusIconProps {
  /** Status effect type (e.g., 'poison', 'burn', 'freeze') */
  statusType: string;

  /** Tooltip text */
  title?: string;

  /** Icon size in pixels */
  size?: number;

  /** Additional CSS class */
  className?: string;
}

/**
 * StatusIcon component
 * Renders a status effect icon sprite with tooltip
 */
export function StatusIcon({
  statusType,
  title,
  size = 24,
  className
}: StatusIconProps): JSX.Element {
  const spriteId = getStatusIconSprite(statusType);

  return (
    <div
      className={`status-icon ${className || ''}`}
      title={title || statusType}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SimpleSprite
        id={spriteId}
        width={size}
        height={size}
        style={{ display: 'block' }}
      />
    </div>
  );
}
