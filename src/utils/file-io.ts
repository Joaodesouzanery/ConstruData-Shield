/** File I/O utilities with error handling */

import { fs, path } from 'zx';

/** Ensure a directory exists, creating it if necessary */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/** Read a file as UTF-8 text, returning null if not found */
export async function readFileOrNull(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/** Write content to a file, creating parent directories as needed */
export async function writeFileSafe(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

/** Append content to a file, creating it if necessary */
export async function appendFileSafe(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.appendFile(filePath, content, 'utf-8');
}
