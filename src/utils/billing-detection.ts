/** Detects spending cap behavior from Claude API responses */

const SPENDING_CAP_PHRASES = [
  'spending cap',
  'spending limit',
  'usage limit',
  'credit limit',
  'billing limit',
  'exceeded your',
  'budget exceeded',
];

/** Check if agent behavior suggests a spending cap was hit */
export function isSpendingCapBehavior(
  turns: number,
  cost: number,
  resultText: string
): boolean {
  // Low-effort completion with zero cost is suspicious
  if (turns <= 2 && cost === 0) {
    const lower = resultText.toLowerCase();
    return SPENDING_CAP_PHRASES.some((phrase) => lower.includes(phrase));
  }
  return false;
}
