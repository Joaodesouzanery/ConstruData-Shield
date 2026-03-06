/** Configuration file loader with YAML parsing and validation */

import { fs } from 'zx';
import yaml from 'js-yaml';
import type { ShieldConfig } from '../types/config.js';
import { Result, ok, err } from '../types/result.js';
import { PentestError } from './error-handling.js';
import { ErrorCode } from '../types/errors.js';

/** Load and validate a YAML configuration file */
export async function loadConfig(configPath: string): Promise<Result<ShieldConfig, PentestError>> {
  try {
    if (!(await fs.pathExists(configPath))) {
      return err(
        new PentestError(
          `Config file not found: ${configPath}`,
          'configuration',
          false,
          { configPath },
          ErrorCode.CONFIG_PARSE_FAILED
        )
      );
    }

    const content = await fs.readFile(configPath, 'utf-8');

    // Use FAILSAFE_SCHEMA to prevent code execution
    const parsed = yaml.load(content, { schema: yaml.FAILSAFE_SCHEMA }) as ShieldConfig;

    if (!parsed || typeof parsed !== 'object') {
      return err(
        new PentestError(
          'Config file is empty or invalid',
          'configuration',
          false,
          { configPath },
          ErrorCode.CONFIG_VALIDATION_FAILED
        )
      );
    }

    // Security validation
    validateConfigSecurity(parsed);

    return ok(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(
      new PentestError(
        `Failed to parse config: ${message}`,
        'configuration',
        false,
        { configPath, originalError: message },
        ErrorCode.CONFIG_PARSE_FAILED
      )
    );
  }
}

/** Validate config values for security issues */
function validateConfigSecurity(config: ShieldConfig): void {
  const allValues = extractStringValues(config);

  for (const value of allValues) {
    // Check for path traversal
    if (value.includes('..') && value.includes('/')) {
      throw new Error(`Potential path traversal in config value: ${value}`);
    }
    // Check for script injection
    if (/<script/i.test(value) || /javascript:/i.test(value)) {
      throw new Error(`Potential injection in config value: ${value}`);
    }
  }
}

/** Extract all string values from an object recursively */
function extractStringValues(obj: unknown): string[] {
  const values: string[] = [];
  if (typeof obj === 'string') {
    values.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      values.push(...extractStringValues(item));
    }
  } else if (obj && typeof obj === 'object') {
    for (const value of Object.values(obj)) {
      values.push(...extractStringValues(value));
    }
  }
  return values;
}
