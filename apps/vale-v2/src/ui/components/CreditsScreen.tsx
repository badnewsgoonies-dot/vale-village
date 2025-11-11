/**
 * Credits Screen Component
 * Data-driven credits display with scroll animation
 */

import { useEffect, useState, useRef } from 'react';
import { z } from 'zod';
import creditsDataRaw from '../../data/credits.json';

interface CreditsScreenProps {
  onExit: () => void;
}

// Zod schema for credits data validation
const CreditsSectionSchema = z.object({
  title: z.string(),
  entries: z.array(z.string()),
});

const CreditsDataSchema = z.object({
  sections: z.array(CreditsSectionSchema),
  options: z.object({
    scrollSpeed: z.number().positive(),
    music: z.string().nullable(),
  }),
});


// Validate credits data at module load
const creditsDataResult = CreditsDataSchema.safeParse(creditsDataRaw);
if (!creditsDataResult.success) {
  throw new Error(`Invalid credits data: ${creditsDataResult.error.message}`);
}
const creditsData = creditsDataResult.data;

export function CreditsScreen({ onExit }: CreditsScreenProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const scrollSpeed = creditsData.options.scrollSpeed || 40;

  // Auto-scroll animation
  useEffect(() => {
    if (isPaused) return;

    const animate = () => {
      setScrollPosition((prev) => {
        const container = containerRef.current;
        if (!container) return prev;
        
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (prev >= maxScroll) {
          // Reached end - stop or loop
          return prev;
        }
        
        return prev + scrollSpeed / 60; // 60fps
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, scrollSpeed]);

  // Update scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onExit();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        color: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
      role="dialog"
      aria-label="Credits"
      aria-modal="true"
    >
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            paddingTop: '100vh', // Start below viewport
            paddingBottom: '100vh', // End below viewport
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              textAlign: 'center',
              marginBottom: '3rem',
              fontWeight: 'bold',
            }}
          >
            Credits
          </h1>

          {creditsData.sections.map((section, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '4rem',
                textAlign: 'center',
              }}
            >
              <h2
                style={{
                  fontSize: '2rem',
                  marginBottom: '1.5rem',
                  fontWeight: 'bold',
                  color: '#ffd700',
                }}
              >
                {section.title}
              </h2>
              {section.entries.map((entry, entryIdx) => (
                <p
                  key={entryIdx}
                  style={{
                    fontSize: '1.25rem',
                    marginBottom: '0.75rem',
                    lineHeight: '1.6',
                  }}
                >
                  {entry}
                </p>
              ))}
            </div>
          ))}

          <div
            style={{
              marginTop: '4rem',
              textAlign: 'center',
              fontSize: '1.5rem',
            }}
          >
            <p>Thank you for playing!</p>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#888',
        }}
      >
        <p>Press ESC or Enter to exit | Space to pause/resume</p>
      </div>
    </div>
  );
}

