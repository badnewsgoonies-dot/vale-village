import React from 'react';
import type { Element } from '@/types/Element';
import './ElementIcon.css';

interface ElementIconProps {
  element: Element;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  className?: string;
}

const elementSymbols: Record<Element, string> = {
  Venus: '♦',
  Mars: '▲',
  Mercury: '●',
  Jupiter: '◆',
  Neutral: '◎'
};

export const ElementIcon: React.FC<ElementIconProps> = ({
  element,
  size = 'medium',
  className = ''
}) => {
  return (
    <div
      className={`element-icon element-icon-${size} element-${element.toLowerCase()} ${className}`}
      aria-hidden="true"
    >
      {elementSymbols[element]}
    </div>
  );
};
