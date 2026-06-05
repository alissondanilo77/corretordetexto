import { z } from 'zod';

export const CorrectionRequestSchema = z.object({
  text: z.string().min(1),
  lang: z.string().default('pt'),
});

export type CorrectionRequest = z.infer<typeof CorrectionRequestSchema>;

export const CorrectionMatchSchema = z.object({
  offset: z.number(),
  length: z.number(),
  replacements: z.array(z.string()),
  message: z.string(),
  ruleId: z.string().optional(),
});

export type CorrectionMatch = z.infer<typeof CorrectionMatchSchema>;

export const CorrectionResponseSchema = z.object({
  matches: z.array(CorrectionMatchSchema),
});

export type CorrectionResponse = z.infer<typeof CorrectionResponseSchema>;

export async function checkText(
  text: string,
  language: string = 'pt'
): Promise<CorrectionMatch[]> {
  try {
    const response = await fetch('/api/correct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang: language }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const validated = CorrectionResponseSchema.parse(data);
    return validated.matches;
  } catch (error) {
    console.error('Error checking text:', error);
    return [];
  }
}
