'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot } from 'lexical';
import { useEditorStore } from '@/lib/store';
import ErrorBoundary from './ErrorBoundary';
import UnderlinePlugin from './UnderlinePlugin';
import { useCallback, useRef } from 'react';
import { checkText } from '@/lib/correction';

const editorConfig = {
  namespace: 'CorretorEditor',
  theme: {
    root: 'editor-root',
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
    },
  },
  onError: (error: Error) => {
    console.error('Lexical error:', error);
  },
};

export default function LexicalEditor() {
  const { setText, language, setIsLoading, setSuggestions } = useEditorStore();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleEditorChange = useCallback(
    (editorState: any) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        setText(textContent);

        // Debounce text checking
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        const newTimer = setTimeout(async () => {
          if (textContent.trim()) {
            setIsLoading(true);
            const matches = await checkText(textContent, language);
            setSuggestions(
              matches.map((match, idx) => ({
                id: `${idx}-${match.offset}`,
                message: match.message,
                replacements: match.replacements,
                offset: match.offset,
                length: match.length,
                ruleId: match.ruleId,
              }))
            );
            setIsLoading(false);
          } else {
            setSuggestions([]);
          }
        }, 500);

        debounceTimerRef.current = newTimer;
      });
    },
    [setText, language, setIsLoading, setSuggestions]
  );

  return (
    <ErrorBoundary>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-content" />
            }
            placeholder={
              <div className="editor-placeholder">
                Comece a digitar para corrigir seu texto...
              </div>
            }
            ErrorBoundary={ErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
          <UnderlinePlugin />
        </div>
      </LexicalComposer>
    </ErrorBoundary>
  );
}
