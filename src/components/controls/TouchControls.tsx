import React, { useRef, useEffect, useState, useCallback } from 'react';
import './TouchControls.css';

export interface TouchControlsProps {
  onDirectionChange?: (direction: { x: number; y: number }) => void;
  onButtonPress?: (button: 'A' | 'B' | 'X' | 'Y' | 'START' | 'SELECT') => void;
  onButtonRelease?: (button: 'A' | 'B' | 'X' | 'Y' | 'START' | 'SELECT') => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirectionChange,
  onButtonPress,
  onButtonRelease,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
  const activeTouchRef = useRef<number | null>(null);

  // Joystick handling
  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    if (!joystickRef.current || activeTouchRef.current !== null) return;

    const touch = e.touches[0];
    activeTouchRef.current = touch.identifier;
    setJoystickActive(true);

    // Prevent default to avoid scrolling
    e.preventDefault();
  }, []);

  const handleJoystickMove = useCallback((e: TouchEvent) => {
    if (!joystickRef.current || !stickRef.current || activeTouchRef.current === null) return;

    const touch = Array.from(e.touches).find(t => t.identifier === activeTouchRef.current);
    if (!touch) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate offset from center
    let offsetX = touch.clientX - centerX;
    let offsetY = touch.clientY - centerY;

    // Calculate distance and angle
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    const maxDistance = rect.width / 2 - 20; // Keep stick within bounds

    // Limit distance
    if (distance > maxDistance) {
      const angle = Math.atan2(offsetY, offsetX);
      offsetX = Math.cos(angle) * maxDistance;
      offsetY = Math.sin(angle) * maxDistance;
    }

    setStickPosition({ x: offsetX, y: offsetY });

    // Normalize direction for game input (-1 to 1)
    const normalizedX = offsetX / maxDistance;
    const normalizedY = offsetY / maxDistance;

    // Trigger direction change with deadzone
    const deadzone = 0.2;
    if (Math.abs(normalizedX) > deadzone || Math.abs(normalizedY) > deadzone) {
      onDirectionChange?.({
        x: Math.abs(normalizedX) > deadzone ? (normalizedX > 0 ? 1 : -1) : 0,
        y: Math.abs(normalizedY) > deadzone ? (normalizedY > 0 ? 1 : -1) : 0,
      });
    } else {
      onDirectionChange?.({ x: 0, y: 0 });
    }

    e.preventDefault();
  }, [onDirectionChange]);

  const handleJoystickEnd = useCallback(() => {
    if (activeTouchRef.current === null) return;

    activeTouchRef.current = null;
    setJoystickActive(false);
    setStickPosition({ x: 0, y: 0 });
    onDirectionChange?.({ x: 0, y: 0 });
  }, [onDirectionChange]);

  // Add touch event listeners for joystick
  useEffect(() => {
    const handleMove = (e: TouchEvent) => handleJoystickMove(e);
    const handleEnd = () => handleJoystickEnd();

    if (joystickActive) {
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, [joystickActive, handleJoystickMove, handleJoystickEnd]);

  // Button handlers
  const handleButtonDown = (button: 'A' | 'B' | 'X' | 'Y' | 'START' | 'SELECT') => (e: React.TouchEvent) => {
    e.preventDefault();
    onButtonPress?.(button);
  };

  const handleButtonUp = (button: 'A' | 'B' | 'X' | 'Y' | 'START' | 'SELECT') => (e: React.TouchEvent) => {
    e.preventDefault();
    onButtonRelease?.(button);
  };

  return (
    <div className="touch-controls">
      {/* Left side - Joystick */}
      <div className="touch-controls-left">
        <div
          ref={joystickRef}
          className={`joystick ${joystickActive ? 'active' : ''}`}
          onTouchStart={handleJoystickStart}
        >
          <div className="joystick-base">
            <div className="joystick-directions">
              <span className="direction-marker up">▲</span>
              <span className="direction-marker down">▼</span>
              <span className="direction-marker left">◀</span>
              <span className="direction-marker right">▶</span>
            </div>
            <div
              ref={stickRef}
              className="joystick-stick"
              style={{
                transform: `translate(${stickPosition.x}px, ${stickPosition.y}px)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="touch-controls-right">
        <div className="action-buttons">
          {/* ABXY diamond layout */}
          <button
            className="action-button button-y"
            onTouchStart={handleButtonDown('Y')}
            onTouchEnd={handleButtonUp('Y')}
          >
            Y
          </button>
          <button
            className="action-button button-x"
            onTouchStart={handleButtonDown('X')}
            onTouchEnd={handleButtonUp('X')}
          >
            X
          </button>
          <button
            className="action-button button-b"
            onTouchStart={handleButtonDown('B')}
            onTouchEnd={handleButtonUp('B')}
          >
            B
          </button>
          <button
            className="action-button button-a"
            onTouchStart={handleButtonDown('A')}
            onTouchEnd={handleButtonUp('A')}
          >
            A
          </button>
        </div>
      </div>

      {/* Center top - Select and Start */}
      <div className="touch-controls-center">
        <button
          className="meta-button button-select"
          onTouchStart={handleButtonDown('SELECT')}
          onTouchEnd={handleButtonUp('SELECT')}
        >
          SELECT
        </button>
        <button
          className="meta-button button-start"
          onTouchStart={handleButtonDown('START')}
          onTouchEnd={handleButtonUp('START')}
        >
          START
        </button>
      </div>
    </div>
  );
};
