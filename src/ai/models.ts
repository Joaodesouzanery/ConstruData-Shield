/** Model tier resolution for ConstruData Shield */

import type { ModelTier } from '../types/agents.js';

const DEFAULT_MODELS: Record<ModelTier, string> = {
  small: 'claude-haiku-4-5-20251001',
  medium: 'claude-sonnet-4-6',
  large: 'claude-opus-4-6',
};

const ENV_KEYS: Record<ModelTier, string> = {
  small: 'ANTHROPIC_SMALL_MODEL',
  medium: 'ANTHROPIC_MEDIUM_MODEL',
  large: 'ANTHROPIC_LARGE_MODEL',
};

/** Resolve the model name for a given tier, checking env overrides */
export function resolveModel(tier: ModelTier = 'medium'): string {
  const envKey = ENV_KEYS[tier];
  return process.env[envKey] || DEFAULT_MODELS[tier];
}
