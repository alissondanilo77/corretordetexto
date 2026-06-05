'use client';

import { useEditorStore } from '@/lib/store';
import LexicalEditor from '@/components/LexicalEditor';
import SuggestionMenu from '@/components/SuggestionMenu';
import { useState, useCallback } from 'react';

export default function Home() {
  const { language, setLanguage, isLoading, suggestions, setSelectedSuggestion } = useEditorStore();
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const handleWordClick = useCallback((e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.toString() === '') {
      setShowMenu(false);
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setMenuPos({
        x: Math.round(rect.left),
        y: Math.round(rect.bottom + 5),
      });
      setShowMenu(true);
    } catch {
      setShowMenu(false);
    }
  }, []);

  const handleSuggestionClick = useCallback((suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setShowMenu(true);
  }, [setSelectedSuggestion]);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
    setSelectedSuggestion(null);
  }, [setSelectedSuggestion]);

  return (
    <div 
      className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-8"

      onClick={() => {
        if (showMenu && window.getSelection()?.toString() === '') {
          closeMenu();
        }
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-2">
            <span className="text-xl">✏️</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
              Corretor de Texto
            </h1>
          </div>
          <p className="mt-3 text-[var(--muted)] max-w-2xl">
            Digite seu texto para corrigir automaticamente em tempo real
          </p>
        </div>


        {/* Editor Section */}
          <div className="bg-[rgba(221,208,200,0.06)] border border-[var(--border)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] p-6 mb-6">

          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <label className="text-sm font-medium text-gray-700">
              Idioma:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:border-gray-400 transition"
            >
              <option value="pt">🇵🇹 Português (Portugal)</option>
              <option value="pt-BR">🇧🇷 Português (Brasil)</option>
              <option value="en">🇬🇧 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>

          <div
            className="border-2 border-gray-200 rounded-lg p-4 min-h-96 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
            onClick={handleWordClick}
            onMouseUp={handleWordClick}
          >
            <LexicalEditor />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
              Verificando texto...
            </div>
          )}
        </div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">⚠️</span>
              {suggestions.length} {suggestions.length === 1 ? 'erro' : 'erros'} encontrados
            </h2>
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="text-red-600 flex-shrink-0 pt-1">📍</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 break-words">
                      {suggestion.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 break-words">
                      <strong>Sugestões:</strong> {suggestion.replacements.slice(0, 3).join(', ')}
                      {suggestion.replacements.length > 3 && ` +${suggestion.replacements.length - 3}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              💡 Clique em um erro ou selecione uma palavra para ver mais sugestões
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && suggestions.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              {isLoading ? '🔍 Verificando...' : '✨ Nenhum erro encontrado!'}
            </p>
          </div>
        )}

        {/* Suggestion Menu */}
        {showMenu && (
          <SuggestionMenu x={menuPos.x} y={menuPos.y} />
        )}
      </div>
    </div>
  );
}

