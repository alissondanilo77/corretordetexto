'use client';

import { useEditorStore } from '@/lib/store';
import { useCallback, useEffect } from 'react';

type SuggestionMenuProps = {
  x: number;
  y: number;
};

export default function SuggestionMenu({ x, y }: SuggestionMenuProps) {
  const { selectedSuggestion, text, setText } = useEditorStore();

  const applySuggestion = useCallback(
    (replacement: string) => {
      if (!selectedSuggestion) return;

      const before = text.substring(0, selectedSuggestion.offset);
      const after = text.substring(
        selectedSuggestion.offset + selectedSuggestion.length
      );
      const newText = before + replacement + after;

      setText(newText);
      
      // Close menu after applying suggestion
      setTimeout(() => {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        document.dispatchEvent(clickEvent);
      }, 100);
    },
    [selectedSuggestion, text, setText]
  );

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSuggestion) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        document.dispatchEvent(clickEvent);
      }
    };

    if (selectedSuggestion) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedSuggestion]);

  if (!selectedSuggestion) return null;

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl z-50 py-2 min-w-max"
      style={{
        left: `${Math.min(x, window.innerWidth - 220)}px`,
        top: `${y}px`,
        maxWidth: '400px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 text-xs text-gray-600 border-b font-medium">
        {selectedSuggestion.message}
      </div>
      <div className="mt-1">
        {selectedSuggestion.replacements.length > 0 ? (
          selectedSuggestion.replacements.slice(0, 5).map((replacement, idx) => (
            <button
              key={idx}
              onClick={() => applySuggestion(replacement)}
              className="block w-full text-left px-3 py-2 hover:bg-blue-100 text-sm transition-colors text-gray-800"
              title={replacement}
            >
              {replacement}
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-xs text-gray-500">
            Nenhuma sugestão disponível
          </div>
        )}
      </div>
    </div>
  );
}
