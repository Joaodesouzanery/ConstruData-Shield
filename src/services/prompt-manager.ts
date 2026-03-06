/**
 * Prompt template loader with variable substitution and include directives.
 *
 * Supports:
 * - @include(path) directives for shared partials
 * - {{VARIABLE}} interpolation (WEB_URL, REPO_PATH, LOGIN_INSTRUCTIONS, etc.)
 * - Pipeline testing mode (loads from prompts/pipeline-testing/ if available)
 */

import { fs, path } from 'zx';
import type { ShieldConfig } from '../types/config.js';
import type { ActivityLogger } from '../types/activity-logger.js';

const PROMPTS_DIR = path.resolve('prompts');
const TESTING_DIR = path.join(PROMPTS_DIR, 'pipeline-testing');

interface PromptContext {
  webUrl: string;
  repoPath: string;
}

/** Load a prompt template by name with variable substitution */
export async function loadPrompt(
  templateName: string,
  context: PromptContext,
  config: ShieldConfig | null,
  pipelineTestingMode: boolean,
  logger: ActivityLogger
): Promise<string> {
  // Resolve template file path
  const filename = `${templateName}.txt`;
  let templatePath: string;

  if (pipelineTestingMode) {
    const testingPath = path.join(TESTING_DIR, filename);
    if (await fs.pathExists(testingPath)) {
      templatePath = testingPath;
      logger.info(`Using pipeline-testing prompt: ${filename}`);
    } else {
      templatePath = path.join(PROMPTS_DIR, filename);
    }
  } else {
    templatePath = path.join(PROMPTS_DIR, filename);
  }

  if (!(await fs.pathExists(templatePath))) {
    throw new Error(`Prompt template not found: ${templatePath}`);
  }

  let content = await fs.readFile(templatePath, 'utf-8');

  // Process @include() directives
  content = await processIncludes(content, PROMPTS_DIR, logger);

  // Apply variable substitutions
  content = applyVariables(content, context, config);

  return content;
}

/** Recursively process @include() directives */
async function processIncludes(
  content: string,
  baseDir: string,
  logger: ActivityLogger
): Promise<string> {
  const includePattern = /@include\(([^)]+)\)/g;
  let result = content;
  let match;

  while ((match = includePattern.exec(result)) !== null) {
    const includePath = path.join(baseDir, match[1]);
    if (await fs.pathExists(includePath)) {
      const includeContent = await fs.readFile(includePath, 'utf-8');
      result = result.replace(match[0], includeContent);
      // Reset regex to handle nested includes
      includePattern.lastIndex = 0;
    } else {
      logger.warn(`Include file not found: ${includePath}`);
    }
  }

  return result;
}

/** Apply variable substitutions to a template */
function applyVariables(
  content: string,
  context: PromptContext,
  config: ShieldConfig | null
): string {
  let result = content;

  // Core variables
  result = result.replace(/\{\{WEB_URL\}\}/g, context.webUrl);
  result = result.replace(/\{\{TARGET_URL\}\}/g, context.webUrl);
  result = result.replace(/\{\{REPO_PATH\}\}/g, context.repoPath);

  // Config-based variables
  if (config?.authentication) {
    const loginInstructions = buildLoginInstructions(config);
    result = result.replace(/\{\{LOGIN_INSTRUCTIONS\}\}/g, loginInstructions);
    result = result.replace(/\{\{CONFIG_CONTEXT\}\}/g, JSON.stringify(config, null, 2));
  } else {
    result = result.replace(/\{\{LOGIN_INSTRUCTIONS\}\}/g, 'No authentication configured.');
    result = result.replace(/\{\{CONFIG_CONTEXT\}\}/g, 'No configuration provided.');
  }

  // Rules variables
  if (config?.rules?.avoid) {
    const avoidRules = config.rules.avoid.map((r) => `- ${r.description}`).join('\n');
    result = result.replace(/\{\{RULES_AVOID\}\}/g, avoidRules);
  } else {
    result = result.replace(/\{\{RULES_AVOID\}\}/g, 'No avoidance rules configured.');
  }

  if (config?.rules?.focus) {
    const focusRules = config.rules.focus.map((r) => `- ${r.description}`).join('\n');
    result = result.replace(/\{\{RULES_FOCUS\}\}/g, focusRules);
  } else {
    result = result.replace(/\{\{RULES_FOCUS\}\}/g, 'No focus rules configured.');
  }

  // MCP server reference
  result = result.replace(/\{\{MCP_SERVER\}\}/g, 'shield-helper');

  return result;
}

/** Build login instructions from config */
function buildLoginInstructions(config: ShieldConfig): string {
  const auth = config.authentication;
  if (!auth) return 'No authentication configured.';

  const lines: string[] = [];
  lines.push(`Login Type: ${auth.login_type}`);
  lines.push(`Login URL: ${auth.login_url}`);
  lines.push(`Username: ${auth.credentials.username}`);
  lines.push(`Password: ${auth.credentials.password}`);

  if (auth.credentials.totp_secret) {
    lines.push(`TOTP Secret: ${auth.credentials.totp_secret} (use generate_totp MCP tool)`);
  }

  if (auth.login_flow) {
    lines.push('\nLogin Steps:');
    for (const step of auth.login_flow) {
      lines.push(`  ${step}`);
    }
  }

  if (auth.success_condition) {
    lines.push(`\nSuccess Condition: ${auth.success_condition.type} = "${auth.success_condition.value}"`);
  }

  return lines.join('\n');
}
