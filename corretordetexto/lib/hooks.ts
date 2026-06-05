import { useCallback } from 'react';
import { useEditorStore } from './store';
import { checkText } from './correction';

export const useCorrectionCheck = () => {
  const { language, setIsLoading, setSuggestions } = useEditorStore();

  const checkAndUpdateSuggestions = useCallback(
    async (textContent: string) => {
      if (!textContent.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
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
      } catch (error) {
        console.error('Error checking text:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [language, setIsLoading, setSuggestions]
  );

  return { checkAndUpdateSuggestions };
};
