/**
 * Save Deliverable MCP Tool
 *
 * Saves agent output files (analysis reports, exploitation evidence)
 * to the deliverables directory within the target repository.
 */

import { z } from 'zod';
import { promises as fsPromises } from 'node:fs';
import { join, dirname } from 'node:path';

const VALID_FILENAMES = [
  'code_analysis_deliverable.md',
  'recon_deliverable.md',
  'injection_analysis_deliverable.md',
  'xss_analysis_deliverable.md',
  'auth_analysis_deliverable.md',
  'ssrf_analysis_deliverable.md',
  'authz_analysis_deliverable.md',
  'injection_exploitation_evidence.md',
  'xss_exploitation_evidence.md',
  'auth_exploitation_evidence.md',
  'ssrf_exploitation_evidence.md',
  'authz_exploitation_evidence.md',
  'comprehensive_security_assessment_report.md',
] as const;

const inputSchema = z.object({
  filename: z.string().describe('Name of the deliverable file to save'),
  content: z.string().describe('Content to write to the file'),
});

/** Create a save_deliverable tool with targetDir captured in closure */
export function createSaveDeliverableTool(targetDir: string) {
  return {
    name: 'save_deliverable',
    description: 'Save a deliverable file (analysis report, exploitation evidence) to the deliverables directory',
    inputSchema,
    handler: async (input: z.infer<typeof inputSchema>) => {
      const { filename, content } = input;

      // Validate filename against allowlist
      if (!VALID_FILENAMES.includes(filename as any)) {
        return {
          content: [{ type: 'text' as const, text: `Error: Invalid filename "${filename}". Must be one of: ${VALID_FILENAMES.join(', ')}` }],
        };
      }

      // Prevent path traversal
      if (filename.includes('..') || filename.includes('/')) {
        return {
          content: [{ type: 'text' as const, text: 'Error: Filename must not contain path separators or ".."' }],
        };
      }

      const filePath = join(targetDir, 'deliverables', filename);

      try {
        await fsPromises.mkdir(dirname(filePath), { recursive: true });
        await fsPromises.writeFile(filePath, content, 'utf-8');

        return {
          content: [{ type: 'text' as const, text: `Deliverable saved: ${filename} (${content.length} bytes)` }],
        };
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text' as const, text: `Error saving deliverable: ${msg}` }],
        };
      }
    },
  };
}
