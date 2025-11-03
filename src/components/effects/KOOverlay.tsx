import React from 'react';
import './KOOverlay.css';

interface KOOverlayProps {
  position: { x: number; y: number };
}

export const KOOverlay: React.FC<KOOverlayProps> = ({ position }) => {
  return (
    <div 
      className="ko-overlay"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="ko-text">K.O.</div>
      <div className="ko-skull">💀</div>
    </div>
  );
};
