import React from 'react';
import './ElementIcon.css';

type Element = 'venus' | 'mars' | 'mercury' | 'jupiter' | 'neutral';

interface ElementIconProps {
  element: Element;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  className?: string;
}

const elementSymbols: Record<Element, string> = {
  venus: '♦',
  mars: '▲',
  mercury: '●',
  jupiter: '◆',
  neutral: '◎'
};

export const ElementIcon: React.FC<ElementIconProps> = ({
  element,
  size = 'medium',
  className = ''
}) => {
  return (
    <div
      className={`element-icon element-icon-${size} element-${element} ${className}`}
      aria-hidden="true"
    >
      {elementSymbols[element]}
    </div>
  );
};
