import React from 'react';
import './Panel.css';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`panel ${className}`}>
      {children}
    </div>
  );
};
