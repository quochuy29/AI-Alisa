/**
 * Remind Command
 * Show phase-specific rules
 */

import chalk from 'chalk';

/**
 * Phase rules for each phase
 */
const PHASE_RULES: Record<string, Array<{ title: string; description: string }>> = {
  discovery: [
    {
      title: 'Ask Context Discovery Questions',
      description: 'Use AskUserQuestion tool to batch 3-5 questions at a time',
    },
    {
      title: 'Research Before Asking',
      description: 'Use Prime Search or Brave Search to research topics before formulating questions',
    },
    {
      title: 'Focus on Context',
      description: 'Questions should focus on understanding the project context, not implementation details',
    },
    {
      title: 'Document Answers',
      description: 'Record answers in 02-discovery-answers.md as they are provided',
    },
    {
      title: 'Meta-Cognitive Checkpoints',
      description: 'After 5-7 questions, use Sequential Thinking to validate understanding',
    },
  ],
  context: [
    {
      title: 'Autonomous Codebase Analysis',
      description: 'Analyze the codebase independently without user prompts',
    },
    {
      title: 'Use Codebase Tools',
      description: 'Use codebase search and file reading tools to gather context',
    },
    {
      title: 'Document Findings',
      description: 'Record findings in 03-context-findings.md with clear structure',
    },
    {
      title: 'Focus on Relevant Areas',
      description: 'Focus analysis on areas relevant to the feature being developed',
    },
    {
      title: 'Identify Patterns',
      description: 'Identify existing patterns, conventions, and architectural decisions',
    },
  ],
  detail: [
    {
      title: 'Ask Expert Detail Questions',
      description: 'Use AskUserQuestion tool to batch 3-5 technical questions',
    },
    {
      title: 'Leverage Codebase Context',
      description: 'Use findings from 03-context-findings.md to inform questions',
    },
    {
      title: 'Focus on Implementation',
      description: 'Questions should focus on technical implementation details',
    },
    {
      title: 'Document Answers',
      description: 'Record answers in 05-detail-answers.md as they are provided',
    },
    {
      title: 'Validate Assumptions',
      description: 'Use Sequential Thinking to validate assumptions before proceeding',
    },
  ],
  requirements_complete: [
    {
      title: 'Generate Requirements Spec',
      description: 'Compile all gathered information into 06-requirements-spec.md',
    },
    {
      title: 'Structure Requirements',
      description: 'Use clear sections: Overview, Functional Requirements, Non-Functional Requirements, Constraints',
    },
    {
      title: 'Include Acceptance Criteria',
      description: 'Define clear acceptance criteria for each requirement',
    },
    {
      title: 'Traceability',
      description: 'Ensure each requirement can be traced back to discovery/detail answers',
    },
    {
      title: 'Update Metadata',
      description: 'Update metadata.json phase to "requirements_complete"',
    },
  ],
  specs_generated: [
    {
      title: 'Design Review',
      description: 'Review 07-design.md for technical soundness and completeness',
    },
    {
      title: 'Approve or Revise',
      description: 'User must approve design or request revisions',
    },
    {
      title: 'Task Breakdown',
      description: 'Review 08-tasks.md for complete task breakdown',
    },
    {
      title: 'Dependencies',
      description: 'Ensure task dependencies are clearly defined',
    },
    {
      title: 'Update Phase',
      description: 'Update metadata.json phase to "design_approved" after approval',
    },
  ],
  design_approved: [
    {
      title: 'Begin Task Execution',
      description: 'Start executing tasks from 08-tasks.md',
    },
    {
      title: 'Follow Order',
      description: 'Execute tasks in the defined order respecting dependencies',
    },
    {
      title: 'Track Progress',
      description: 'Update task completion status in metadata.json',
    },
    {
      title: 'Handle Issues',
      description: 'Use bug-fix command for any issues encountered',
    },
    {
      title: 'Handle Changes',
      description: 'Use spec-enhance command for any required changes',
    },
  ],
  specs_complete: [
    {
      title: 'Review Tasks',
      description: 'Review all tasks in 08-tasks.md before execution',
    },
    {
      title: 'Estimate Effort',
      description: 'Provide effort estimates for each task',
    },
    {
      title: 'Identify Risks',
      description: 'Identify potential risks and mitigation strategies',
    },
    {
      title: 'Update Phase',
      description: 'Update metadata.json phase to "executing"',
    },
    {
      title: 'Begin Execution',
      description: 'Run specs-execute command to start task execution',
    },
  ],
  executing: [
    {
      title: 'Execute Sequentially',
      description: 'Execute tasks one at a time in the defined order',
    },
    {
      title: 'Update Progress',
      description: 'Update task completion status after each task',
    },
    {
      title: 'Test Changes',
      description: 'Test each change before proceeding to the next task',
    },
    {
      title: 'Report Bugs',
      description: 'Use bug-fix command for any bugs encountered',
    },
    {
      title: 'Request Changes',
      description: 'Use spec-enhance command for any required changes',
    },
  ],
  implemented: [
    {
      title: 'Code Review',
      description: 'Run code-review command for technical quality analysis',
    },
    {
      title: 'Alignment Check',
      description: 'Run revise command to verify alignment with requirements',
    },
    {
      title: 'Final Testing',
      description: 'Perform comprehensive testing of the implementation',
    },
    {
      title: 'Documentation',
      description: 'Update any relevant documentation',
    },
    {
      title: 'Complete Session',
      description: 'Run end command to complete and archive the session',
    },
  ],
  bug_fixing: [
    {
      title: 'Two-Step Method',
      description: 'Follow the two-step bug fix method: Analysis → Fix',
    },
    {
      title: 'Root Cause Analysis',
      description: 'Use Sequential Thinking to analyze root cause before fixing',
    },
    {
      title: 'Document Bug',
      description: 'Document bug details in 09-bug-tracker.md',
    },
    {
      title: 'Propose Solution',
      description: 'Propose fix solution with rationale',
    },
    {
      title: 'Verify Fix',
      description: 'Verify fix resolves the issue before proceeding',
    },
  ],
  change_review: [
    {
      title: 'Document Change',
      description: 'Document change details in 10-change-log.md',
    },
    {
      title: 'Impact Analysis',
      description: 'Analyze impact on existing implementation and requirements',
    },
    {
      title: 'Update Backlog',
      description: 'Update 11-change-backlog.md with pending changes',
    },
    {
      title: 'Version Control',
      description: 'Ensure proper version control practices are followed',
    },
    {
      title: 'Update Phase',
      description: 'Update metadata.json phase after change is processed',
    },
  ],
};

/**
 * Show phase rules
 */
export async function execute(): Promise<void> {
  console.log(chalk.bold('\n📋 Phase-Specific Rules\n'));
  console.log(chalk.gray('═'.repeat(60)));

  // Display all phases with their rules
  for (const [phase, rules] of Object.entries(PHASE_RULES)) {
    console.log(`\n${chalk.cyan(phase.toUpperCase())} Phase`);
    console.log(chalk.gray('─'.repeat(60)));

    for (const rule of rules) {
      console.log(`  ${chalk.yellow('•')} ${chalk.bold(rule.title)}`);
      console.log(`    ${chalk.dim(rule.description)}`);
      console.log('');
    }
  }

  console.log(chalk.gray('═'.repeat(60)));

  // Display universal rules
  console.log(chalk.bold('\n🌐 Universal Rules\n'));
  console.log(chalk.gray('═'.repeat(60)));

  const universalRules = [
    {
      title: 'Always Verify Session State',
      description: 'Read requirements/.current-requirement to identify active session',
    },
    {
      title: 'Read Metadata',
      description: 'Always read metadata.json to understand current phase and progress',
    },
    {
      title: 'Use File Structure',
      description: 'Follow the standard file structure for all requirement sessions',
    },
    {
      title: 'Update Metadata',
      description: 'Update metadata.json after phase transitions',
    },
    {
      title: 'Traceability',
      description: 'Maintain traceability from requirements to implementation',
    },
    {
      title: 'Version Control',
      description: 'Use version control for all code changes',
    },
    {
      title: 'Documentation',
      description: 'Keep all documentation up to date',
    },
  ];

  for (const rule of universalRules) {
    console.log(`  ${chalk.green('✓')} ${chalk.bold(rule.title)}`);
    console.log(`    ${chalk.dim(rule.description)}`);
    console.log('');
  }

  console.log(chalk.gray('═'.repeat(60)));
  console.log(chalk.dim('\nUse specific phase rules to guide your workflow.'));
  console.log(chalk.dim('Universal rules apply to all phases.'));
}
