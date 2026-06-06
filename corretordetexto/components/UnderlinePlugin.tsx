'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $isTextNode,
  TextNode,
  RangeSelection,
  LexicalNode,
} from 'lexical';
import { useEffect } from 'react';
import { useEditorStore } from '@/lib/store';

const ERROR_CLASS = 'text-red-500 underline decoration-red-500 decoration-wavy';

export default function UnderlinePlugin() {
  const [editor] = useLexicalComposerContext();
  const { suggestions, text } = useEditorStore();

  useEffect(() => {
    if (!text.trim()) return;

    const applyUnderlines = () => {
      editor.update(() => {
        const root = $getRoot();
        const allNodes = root.getAllTextNodes();


        // Rebuild text with error tracking
        let currentOffset = 0;
        const errorRanges = new Map<number, { end: number; error: boolean }>();

        // Mark error regions
        suggestions.forEach(({ offset, length }) => {
          errorRanges.set(offset, { end: offset + length, error: true });
        });

        // Apply visual indicators
        allNodes.forEach((node) => {
          if (!$isTextNode(node)) return;

          const nodeText = node.getTextContent();
          const nodeStart = currentOffset;
          const nodeEnd = currentOffset + nodeText.length;

          // Check if this node contains any errors
          let hasError = false;
          for (const [errorStart, errorRange] of errorRanges) {
            if (errorStart < nodeEnd && errorRange.end > nodeStart) {
              hasError = true;
              break;
            }
          }

          // Never mutate private fields like __style / __text.
          // Use Lexical's public styling API.
          const writableNode = node.getWritable();
          if (hasError) {
            writableNode.setStyle(
              'color: rgb(239, 68, 68); text-decoration: underline wavy rgb(239, 68, 68);'
            );
          } else {
            writableNode.setStyle('');
          }

          currentOffset = nodeEnd;
        });
      }, { discrete: true });
    };

    const timer = setTimeout(applyUnderlines, 50);
    return () => clearTimeout(timer);
  }, [suggestions, text, editor]);

  return null;
}

