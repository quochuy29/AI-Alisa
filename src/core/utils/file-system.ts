/**
 * File System Utilities
 * Provides helper functions for file system operations
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { existsSync } from 'fs';

/**
 * Ensure a directory exists, creating it if necessary
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Check if a file or directory exists
 */
export function exists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Read a file's contents
 */
export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

/**
 * Write content to a file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Copy a file from source to destination
 */
export async function copyFile(source: string, destination: string): Promise<void> {
  const dir = path.dirname(destination);
  await ensureDir(dir);
  await fs.copyFile(source, destination);
}

/**
 * Delete a file or directory
 */
export async function deletePath(filePath: string): Promise<void> {
  try {
    await fs.rm(filePath, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors if path doesn't exist
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * List all files in a directory matching a pattern
 */
export async function listFiles(dirPath: string, pattern: string = '*'): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    return files.filter(file => {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(file);
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Get to home directory for the current platform
 */
export function getHomeDir(): string {
  return os.homedir();
}

/**
 * Installation scope:
 *   project   → {CWD}/.claude / .cursor / .github
 *   workspace → same as project (CWD-relative)
 *   userdata  → ~/.claude / ~/.cursor  (no user-level path for Copilot)
 */
export type InstallScope = 'project' | 'workspace' | 'userdata';

/**
 * Get to Claude Code commands directory for the current platform
 * userdata  (default): ~/.claude/commands/
 * project / workspace: {CWD}/.claude/commands/
 */
export function getClaudeCommandsDir(scope: InstallScope = 'userdata'): string {
  const base = scope === 'userdata' ? getHomeDir() : process.cwd();
  return path.join(base, '.claude', 'commands');
}

/**
 * Get Claude Code agents directory for the current platform
 * userdata  (default): ~/.claude/agents/
 * project / workspace: {CWD}/.claude/agents/
 */
export function getClaudeAgentsDir(scope: InstallScope = 'userdata'): string {
  const base = scope === 'userdata' ? getHomeDir() : process.cwd();
  return path.join(base, '.claude', 'agents');
}

/**
 * Get Cursor commands directory
 * project / workspace (default): {CWD}/.cursor/commands/
 * userdata: ~/.cursor/commands/
 */
export function getCursorCommandsDir(scope: InstallScope = 'project'): string {
  const base = scope === 'userdata' ? getHomeDir() : process.cwd();
  return path.join(base, '.cursor', 'commands');
}

/**
 * Get Cursor agents directory
 * project / workspace (default): {CWD}/.cursor/agents/
 * userdata: ~/.cursor/agents/
 */
export function getCursorAgentsDir(scope: InstallScope = 'project'): string {
  const base = scope === 'userdata' ? getHomeDir() : process.cwd();
  return path.join(base, '.cursor', 'agents');
}

/**
 * Get Cursor rules directory
 * project / workspace (default): {CWD}/.cursor/rules/
 * userdata: ~/.cursor/rules/
 */
export function getCursorRulesDir(scope: InstallScope = 'project'): string {
  const base = scope === 'userdata' ? getHomeDir() : process.cwd();
  return path.join(base, '.cursor', 'rules');
}

/**
 * Get Cursor Agent Skills base directory.
 * Per Agent Skills open standard, project skills live in {CWD}/.cursor/skills/
 * Each skill is a sub-directory containing a SKILL.md file.
 * userdata: ~/.cursor/skills/
 */
export function getCursorSkillsDir(scope: InstallScope = 'project'): string {
  const base = scope === 'userdata' ? getHomeDir() : process.cwd();
  return path.join(base, '.cursor', 'skills');
}

/**
 * Get Claude Code Agent Skills base directory.
 * Per Agent Skills open standard, project skills live in {CWD}/.claude/skills/
 * Each skill is a sub-directory containing a SKILL.md file.
 * userdata: ~/.claude/skills/
 */
export function getClaudeSkillsDir(scope: InstallScope = 'userdata'): string {
  const base = scope === 'userdata' ? getHomeDir() : process.cwd();
  return path.join(base, '.claude', 'skills');
}

/**
 * Get GitHub Copilot prompts directory
 * Copilot has no official user-level path — always installs to {CWD}/.github/prompts/
 */
export function getCopilotPromptsDir(_scope: InstallScope = 'project'): string {
  return path.join(process.cwd(), '.github', 'prompts');
}

/**
 * Get GitHub Copilot agents directory
 * Copilot has no official user-level path — always installs to {CWD}/.github/agents/
 */
export function getCopilotAgentsDir(_scope: InstallScope = 'project'): string {
  return path.join(process.cwd(), '.github', 'agents');
}

/**
 * Get GitHub Copilot Agent Skills base directory.
 * Per Agent Skills open standard (agentskills.io), project skills live in {CWD}/.github/skills/
 * Each skill is a sub-directory containing a SKILL.md file whose `name` matches the dir name.
 */
export function getCopilotSkillsDir(_scope: InstallScope = 'project'): string {
  return path.join(process.cwd(), '.github', 'skills');
}
