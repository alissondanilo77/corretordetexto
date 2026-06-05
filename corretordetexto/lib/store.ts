import { create } from 'zustand';

export type Suggestion = {
  id: string;
  message: string;
  replacements: string[];
  offset: number;
  length: number;
  ruleId?: string;
};

type EditorStore = {
  text: string;
  setText: (text: string) => void;
  suggestions: Suggestion[];
  setSuggestions: (suggestions: Suggestion[]) => void;
  selectedSuggestion: Suggestion | null;
  setSelectedSuggestion: (suggestion: Suggestion | null) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  text: '',
  setText: (text) => set({ text }),
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
  selectedSuggestion: null,
  setSelectedSuggestion: (suggestion) => set({ selectedSuggestion: suggestion }),
  language: 'pt',
  setLanguage: (lang) => set({ language: lang }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
