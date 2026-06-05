export type CorrectionMatch = {
  id: number;
  ruleId: string;
  message: string;
  offset: number;
  length: number;
  replacements: string[];
};

export type CorrectionResponse = {
  original: string;
  corrected: string;
  matches: CorrectionMatch[];
};

