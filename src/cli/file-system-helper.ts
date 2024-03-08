import { promises } from 'fs';

/**
 * Checks if a file or directory exists.
 * @param path
 * @returns `true` if the file or directory exists, `false` otherwise.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await promises.access(path);
    return true;
  } catch {
    return false;
  }
}