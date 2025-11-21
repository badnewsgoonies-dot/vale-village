/**
 * Chapter Indicator Component
 * Displays current chapter with title
 */

interface ChapterIndicatorProps {
  chapter: number;
}

const chapterTitles: Record<number, string> = {
  1: 'Chapter 1: The Awakening',
  2: 'Chapter 2: The Journey',
  3: 'Chapter 3: The Guardian',
  4: 'Epilogue',
};

export function ChapterIndicator({ chapter }: ChapterIndicatorProps) {
  const title = chapterTitles[chapter] || `Chapter ${chapter}`;

  return (
    <div
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#e3f2fd',
        border: '1px solid #90caf9',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        color: '#1565c0',
        display: 'inline-block',
      }}
    >
      {title}
    </div>
  );
}

