/**
 * Integration tests for init command
 * TASK: #13 - FR-1 through FR-7
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

// Mock display utilities to suppress console output during tests
vi.mock('../../src/core/utils/display.js', () => ({
  showInitHeader: vi.fn(),
  withSpinner: vi.fn(async (_msg: string, fn: () => Promise<unknown>) => fn()),
  showInitSummary: vi.fn(),
  Colors: {
    success: (s: string) => s,
    warning: (s: string) => s,
    info: (s: string) => s,
    muted: (s: string) => s,
    primary: (s: string) => s,
    accent: (s: string) => s,
    brand: (s: string) => s,
  },
}));

// Mock interactive utilities
vi.mock('../../src/core/utils/interactive.js', () => ({
  askSelect: vi.fn(),
}));

// We need to mock the path functions to redirect to temp dirs
let tempDir: string;
let claudeTempDir: string;

vi.mock('../../src/core/utils/file-system.js', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../src/core/utils/file-system.js')>();
  return {
    ...original,
    getClaudeCommandsDir: () => claudeTempDir,
    getCursorCommandsDir: () => path.join(tempDir, '.cursor', 'commands'),
    getCopilotPromptsDir: () => path.join(tempDir, '.github', 'prompts'),
  };
});

// Store original values
const originalCwd = process.cwd;
const originalExit = process.exit;
const originalCI = process.env.CI;

beforeEach(async () => {
  tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'init-test-'));
  claudeTempDir = path.join(tempDir, '.claude', 'commands');

  // Override process.cwd to return temp dir
  process.cwd = () => tempDir;

  // Mock process.exit to throw instead of exiting
  process.exit = vi.fn((code?: number) => {
    throw new Error(`process.exit(${code})`);
  }) as never;

  // Set CI to skip interactive prompts
  process.env.CI = 'true';
});

afterEach(async () => {
  process.cwd = originalCwd;
  process.exit = originalExit;
  process.env.CI = originalCI || '';

  // Clean up temp directory
  await fsPromises.rm(tempDir, { recursive: true, force: true });
  vi.restoreAllMocks();
});

// Dynamic import to ensure mocks are applied
async function getInit() {
  const mod = await import('../../src/commands/init.js');
  return mod.init;
}

describe('init --editor=vscode-copilot', () => {
  it('creates .github/prompts/ directory with 12 .prompt.md files', async () => {
    const init = await getInit();
    await init({ force: true, editor: 'vscode-copilot' });

    const promptsDir = path.join(tempDir, '.github', 'prompts');
    expect(fs.existsSync(promptsDir)).toBe(true);

    const files = await fsPromises.readdir(promptsDir);
    const promptFiles = files.filter(f => f.endsWith('.prompt.md'));
    expect(promptFiles).toHaveLength(12);
  });

  it('does not create VSCODE-COPILOT.md in project root (doc generation removed)', async () => {
    const init = await getInit();
    await init({ force: true, editor: 'vscode-copilot' });

    const docPath = path.join(tempDir, 'VSCODE-COPILOT.md');
    expect(fs.existsSync(docPath)).toBe(false);
  });

  it('creates .github/prompts/README.md', async () => {
    const init = await getInit();
    await init({ force: true, editor: 'vscode-copilot' });

    const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
  });

  it('prompt files have valid YAML frontmatter with mode: agent', async () => {
    const init = await getInit();
    await init({ force: true, editor: 'vscode-copilot' });

    const promptsDir = path.join(tempDir, '.github', 'prompts');
    const files = await fsPromises.readdir(promptsDir);
    const promptFiles = files.filter(f => f.endsWith('.prompt.md'));

    for (const file of promptFiles) {
      const content = await fsPromises.readFile(path.join(promptsDir, file), 'utf-8');
      expect(content).toMatch(/^---/);
      expect(content).toContain("agent: 'agent'");
    }
  });
});

describe('init --editor=all', () => {
  it('creates all 3 editor directories with correct file counts', async () => {
    const init = await getInit();
    await init({ force: true, editor: 'all' });

    // Claude Code commands
    expect(fs.existsSync(claudeTempDir)).toBe(true);
    const claudeFiles = (await fsPromises.readdir(claudeTempDir)).filter(f => f.endsWith('.md'));
    expect(claudeFiles.length).toBeGreaterThanOrEqual(12);

    // Cursor commands
    const cursorDir = path.join(tempDir, '.cursor', 'commands');
    expect(fs.existsSync(cursorDir)).toBe(true);
    const cursorFiles = (await fsPromises.readdir(cursorDir)).filter(f => f.endsWith('.md'));
    // 12 commands + README.md = 13
    expect(cursorFiles.length).toBeGreaterThanOrEqual(12);

    // Copilot prompts
    const copilotDir = path.join(tempDir, '.github', 'prompts');
    expect(fs.existsSync(copilotDir)).toBe(true);
    const copilotFiles = (await fsPromises.readdir(copilotDir)).filter(f => f.endsWith('.prompt.md'));
    expect(copilotFiles).toHaveLength(12);
  });
});

describe('backward compatibility', () => {
  it('--editor=claude-code installs to claude commands dir', async () => {
    const init = await getInit();
    await init({ force: true, editor: 'claude-code' });

    expect(fs.existsSync(claudeTempDir)).toBe(true);
    const files = (await fsPromises.readdir(claudeTempDir)).filter(f => f.endsWith('.md'));
    expect(files.length).toBeGreaterThanOrEqual(12);
  });

  it('--editor=cursor installs to .cursor/commands/', async () => {
    const init = await getInit();
    await init({ force: true, editor: 'cursor' });

    const cursorDir = path.join(tempDir, '.cursor', 'commands');
    expect(fs.existsSync(cursorDir)).toBe(true);
    const files = (await fsPromises.readdir(cursorDir)).filter(f => f.endsWith('.md'));
    expect(files.length).toBeGreaterThanOrEqual(12);
  });

  it('--editor=both works and shows deprecation warning', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const init = await getInit();
    await init({ force: true, editor: 'both' });

    // Both Claude Code and Cursor dirs should exist
    expect(fs.existsSync(claudeTempDir)).toBe(true);
    const cursorDir = path.join(tempDir, '.cursor', 'commands');
    expect(fs.existsSync(cursorDir)).toBe(true);

    // Deprecation warning should have been logged
    const calls = consoleSpy.mock.calls.flat().map(String);
    const hasDeprecation = calls.some(c => c.includes('deprecated'));
    expect(hasDeprecation).toBe(true);
  });
});

describe('error handling', () => {
  it('invalid editor value calls process.exit(1)', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const init = await getInit();

    await expect(init({ force: true, editor: 'invalid-editor' })).rejects.toThrow('process.exit(1)');
    const calls = errorSpy.mock.calls.flat().map(String);
    expect(calls.some(c => c.includes('Invalid editor'))).toBe(true);
  });

  it('without --force skips existing requirements directory', async () => {
    // Create requirements dir first
    await fsPromises.mkdir(path.join(tempDir, 'requirements'), { recursive: true });

    const consoleSpy = vi.spyOn(console, 'log');
    const init = await getInit();
    await init({ editor: 'claude-code' }); // no force

    const calls = consoleSpy.mock.calls.flat().map(String);
    expect(calls.some(c => c.includes('already exists'))).toBe(true);
  });
});
