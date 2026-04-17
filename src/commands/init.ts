/**
 * Init Command
 * Initializes the requirements directory with .current-requirement file
 * and installs requirement command stack to Claude Code
 */

import { TemplateManager, EditorType } from '../core/templates/index.js';
import { ensureDir, exists, writeFile, getClaudeCommandsDir, getClaudeSkillsDir, getCursorCommandsDir, getCursorAgentsDir, getCursorSkillsDir, getCopilotPromptsDir, getCopilotAgentsDir, getCopilotSkillsDir, InstallScope } from '../core/utils/file-system.js';
import { askSelect } from '../core/utils/interactive.js';
import { showInitHeader, withSpinner, showInitSummary } from '../core/utils/display.js';
import * as path from 'path';

/**
 * Initialize the requirements directory
 */
export async function init(options: { force?: boolean; editor?: string; scope?: string }): Promise<void> {
  const REQUIREMENTS_DIR = 'requirements';
  const CURRENT_REQUIREMENT_FILE = path.join(REQUIREMENTS_DIR, '.current-requirement');

  try {
    showInitHeader();

    // Validate and select scope
    const validScopes: InstallScope[] = ['project', 'workspace', 'userdata'];
    let selectedScope: InstallScope = 'project';

    if (options.scope) {
      if (!validScopes.includes(options.scope as InstallScope)) {
        console.error(`Error: Invalid scope value '${options.scope}'. Valid options: ${validScopes.join(', ')}`);
        process.exit(1);
      }
      selectedScope = options.scope as InstallScope;
    } else if (!process.env.CI) {
      selectedScope = await askSelect<InstallScope>(
        'Where do you want to install? (scope)',
        [
          { name: 'Project  — {CWD}/.claude / .cursor / .github  (current project only)', value: 'project' },
          { name: 'Workspace — same as Project (CWD-relative alias)', value: 'workspace' },
          { name: 'UserData  — ~/.claude / ~/.cursor              (system-wide)', value: 'userdata' },
        ],
        'project'
      );
    }

    // Validate and select editor
    const validEditors = ['claude-code', 'cursor', 'vscode-copilot', 'both', 'all'];
    let selectedEditor: EditorType = 'claude-code';

    // If editor option is provided, validate it
    if (options.editor) {
      if (!validEditors.includes(options.editor)) {
        console.error(`Error: Invalid editor value '${options.editor}'. Valid options: ${validEditors.join(', ')}`);
        process.exit(1);
      }
      selectedEditor = options.editor as EditorType;
    } else if (!process.env.CI) {
      // Show interactive prompt if not in CI and no explicit editor flag
      const editorChoice = await askSelect<EditorType | 'cancel'>(
        'Which editor do you use?',
        [
          { name: 'Claude Code', value: 'claude-code' },
          { name: 'Cursor', value: 'cursor' },
          { name: 'VSCode + Copilot', value: 'vscode-copilot' },
          { name: 'All (install to all editors)', value: 'all' },
          { name: 'Cancel (exit without installing)', value: 'cancel' },
        ],
        'claude-code'
      );

      if (editorChoice === 'cancel') {
        console.log('Installation cancelled.');
        return;
      }

      selectedEditor = editorChoice;
    }

    // Check if requirements directory already exists
    if (exists(REQUIREMENTS_DIR) && !options.force) {
      console.log('Requirements directory already exists.');
      console.log('Use --force to overwrite existing files.');
      return;
    }

    // Create requirements directory
    await withSpinner('Setting up requirements directory', async () => {
      await ensureDir(REQUIREMENTS_DIR);
      await writeFile(CURRENT_REQUIREMENT_FILE, '');
    });

    // Install slash commands to selected editor(s)
    const templateManager = new TemplateManager();
    templateManager.setForceMode(options.force || false);
    templateManager.setScope(selectedScope);

    const editorDisplayNames: Record<EditorType, string> = {
      'claude-code': 'Claude Code',
      'cursor': 'Cursor',
      'vscode-copilot': 'VSCode + Copilot',
      'both': 'Claude Code + Cursor',
      'all': 'All Editors',
    };

    await withSpinner(`Installing to ${editorDisplayNames[selectedEditor]}`, () =>
      templateManager.installSlashCommands(selectedEditor)
    );

    showInitSummary({
      selectedEditor,
      scope: selectedScope,
      claudeDir: getClaudeCommandsDir(selectedScope),
      claudeSkillsDir: getClaudeSkillsDir(selectedScope),
      cursorDir: getCursorCommandsDir(selectedScope),
      cursorAgentsDir: getCursorAgentsDir(selectedScope),
      cursorSkillsDir: getCursorSkillsDir(selectedScope),
      copilotDir: getCopilotPromptsDir(selectedScope),
      copilotAgentsDir: getCopilotAgentsDir(selectedScope),
      copilotSkillsDir: getCopilotSkillsDir(selectedScope),
    });
  } catch (error) {
    console.error('Error initializing requirements directory:', error);
    throw error;
  }
}
