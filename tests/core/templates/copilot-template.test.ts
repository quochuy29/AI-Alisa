import { describe, it, expect } from 'vitest';
import {
  mapAllowedToolsToCopilotTools,
  generateCopilotPrompts,
  generateCopilotFrontmatter,
  type CopilotPromptData,
} from '../../../src/core/templates/copilot-template.js';

describe('mapAllowedToolsToCopilotTools', () => {
  it('maps Bash to execute tools', () => {
    expect(mapAllowedToolsToCopilotTools('Bash(*)')).toEqual(['execute/runInTerminal', 'execute/getTerminalOutput']);
  });

  it('maps Read to search/codebase', () => {
    expect(mapAllowedToolsToCopilotTools('Read(*)')).toEqual(['search/codebase']);
  });

  it('maps Write to edit/editFiles', () => {
    expect(mapAllowedToolsToCopilotTools('Write(*)')).toEqual(['edit/editFiles']);
  });

  it('maps combined tools and returns 4 unique entries', () => {
    const result = mapAllowedToolsToCopilotTools('Bash(*), Read(*), Write(*)');
    expect(result).toEqual(['execute/runInTerminal', 'execute/getTerminalOutput', 'search/codebase', 'edit/editFiles']);
    expect(result).toHaveLength(4);
  });

  it('ignores unsupported tools', () => {
    expect(mapAllowedToolsToCopilotTools('UnknownTool(*)')).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(mapAllowedToolsToCopilotTools('')).toEqual([]);
  });
});

describe('generateCopilotPrompts', () => {
  const prompts = generateCopilotPrompts();
  const entries = Object.entries(prompts);

  it('returns exactly 12 prompts', () => {
    expect(entries).toHaveLength(12);
  });

  it("all prompts have agent: 'agent'", () => {
    for (const [, prompt] of entries) {
      expect(prompt.agent).toBe('agent');
    }
  });

  it('all prompts have non-empty tools array', () => {
    for (const [, prompt] of entries) {
      expect(prompt.tools.length).toBeGreaterThan(0);
    }
  });

  it('interactive prompts include vscode/askQuestions', () => {
    const interactive = ['requirements-start', 'requirements-bug-fix', 'requirements-spec-enhance', 'requirements-specs-generate'];
    for (const name of interactive) {
      expect(prompts[name]?.tools).toContain('vscode/askQuestions');
    }
  });

  it('read-only prompts do not include vscode/askQuestions', () => {
    const readOnly = ['requirements-remind', 'requirements-current', 'requirements-status'];
    for (const name of readOnly) {
      expect(prompts[name]?.tools).not.toContain('vscode/askQuestions');
    }
  });

  it('all prompts have description and content', () => {
    for (const [, prompt] of entries) {
      expect(prompt.description).toBeTruthy();
      expect(prompt.content).toBeTruthy();
    }
  });
});

describe('generateCopilotFrontmatter', () => {
  const prompt: CopilotPromptData = {
    agent: 'agent',
    tools: ['search/codebase', 'edit/editFiles'],
    description: 'Test description',
    content: 'Test content',
  };
  const frontmatter = generateCopilotFrontmatter(prompt);

  it('starts with ---', () => {
    expect(frontmatter.startsWith('---')).toBe(true);
  });

  it('ends with ---', () => {
    expect(frontmatter.endsWith('---')).toBe(true);
  });

  it("contains agent: 'agent'", () => {
    expect(frontmatter).toContain("agent: 'agent'");
  });

  it('contains tools in inline array format', () => {
    expect(frontmatter).toContain("tools: ['search/codebase', 'edit/editFiles']");
  });
});
