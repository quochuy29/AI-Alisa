/**
 * Code Review Command
 * Perform technical quality analysis with eight pillars
 */

import chalk from 'chalk';
import { readFile, exists } from '../core/utils/file-system.js';
import * as path from 'path';

/**
 * Metadata interface for requirement sessions
 */
interface IMetadata {
  sessionId: string;
  phase: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  files: string[];
}

/**
 * Code Review Pillar interface
 */
interface IReviewPillar {
  name: string;
  description: string;
  checks: string[];
}

/**
 * Perform technical quality analysis with eight pillars
 */
export async function execute(): Promise<void> {
  const REQUIREMENTS_DIR = 'requirements';
  const CURRENT_REQUIREMENT_FILE = path.join(REQUIREMENTS_DIR, '.current-requirement');

  try {
    // Check if requirements directory exists
    if (!exists(REQUIREMENTS_DIR)) {
      console.log(chalk.yellow('Requirements directory not found.'));
      console.log(chalk.dim('Run `requirement-commands init` to initialize requirements directory.'));
      return;
    }

    // Check if there's a current requirement
    if (!exists(CURRENT_REQUIREMENT_FILE)) {
      console.log(chalk.yellow('No active requirement session found.'));
      console.log(chalk.dim('Run `requirement-commands start` to begin a new requirement session.'));
      return;
    }

    // Read current requirement pointer
    const currentSession = await readFile(CURRENT_REQUIREMENT_FILE);
    const sessionPath = currentSession.trim();

    if (!sessionPath) {
      console.log(chalk.yellow('No active requirement session found.'));
      console.log(chalk.dim('Run `requirement-commands start` to begin a new requirement session.'));
      return;
    }

    // Check if session directory exists
    const fullSessionPath = path.join(REQUIREMENTS_DIR, sessionPath);
    if (!exists(fullSessionPath)) {
      console.log(chalk.yellow(`Session directory not found: ${sessionPath}`));
      console.log(chalk.dim('The current requirement session may have been moved or deleted.'));
      return;
    }

    // Read metadata
    const metadataPath = path.join(fullSessionPath, 'metadata.json');
    if (!exists(metadataPath)) {
      console.log(chalk.yellow(`Metadata file not found: ${metadataPath}`));
      console.log(chalk.dim('The session may be corrupted or incomplete.'));
      return;
    }

    const metadataContent = await readFile(metadataPath);
    const metadata: IMetadata = JSON.parse(metadataContent);

    // Display header
    console.log(chalk.bold('\n🔍 Code Review - Eight Pillar Analysis\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`${chalk.blue('Session:')} ${metadata.sessionId}`);
    console.log(`${chalk.blue('Current Phase:')} ${metadata.phase}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Display eight pillars of code review
    const pillars = getEightPillars();

    console.log(chalk.bold('\n🏛️ Eight Pillars of Code Review\n'));
    console.log(chalk.gray('═'.repeat(60)));

    for (const pillar of pillars) {
      console.log(`${chalk.bold(pillar.name)}: ${pillar.description}`);
      console.log(chalk.dim('Checks:'));
      for (const check of pillar.checks) {
        console.log(chalk.dim(`  - ${check}`));
      }
      console.log('');
    }

    console.log(chalk.gray('═'.repeat(60)));

    // Display code review workflow
    console.log(chalk.bold('\n⚙️ Code Review Workflow\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`  ${chalk.cyan('1.')} ${chalk.bold('Preparation')}`);
    console.log(`      ${chalk.dim('Review requirements, design, and tasks')}`);
    console.log(`      ${chalk.dim('Understand the context and objectives')}`);

    console.log(`  ${chalk.cyan('2.')} ${chalk.bold('Code Analysis')}`);
    console.log(`      ${chalk.dim('Analyze code changes against eight pillars')}`);
    console.log(`      ${chalk.dim('Document findings and issues')}`);

    console.log(`  ${chalk.cyan('3.')} ${chalk.bold('Quality Assessment')}`);
    console.log(`      ${chalk.dim('Assess overall code quality')}`);
    console.log(`      ${chalk.dim('Identify security vulnerabilities')}`);
    console.log(`      ${chalk.dim('Check for performance issues')}`);

    console.log(`  ${chalk.cyan('4.')} ${chalk.bold('Alignment Verification')}`);
    console.log(`      ${chalk.dim('Verify alignment with requirements')}`);
    console.log(`      ${chalk.dim('Check consistency with design')}`);
    console.log(`      ${chalk.dim('Ensure task completion')}`);

    console.log(`  ${chalk.cyan('5.')} ${chalk.bold('Report Generation')}`);
    console.log(`      ${chalk.dim('Generate comprehensive review report')}`);
    console.log(`      ${chalk.dim('Provide actionable recommendations')}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Display code review options
    console.log(chalk.bold('\n📝 Code Review Options\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`  ${chalk.cyan('1.')} ${chalk.bold('Start Code Review')}`);
    console.log(`      ${chalk.dim('Begin comprehensive code review process')}`);
    console.log(`      ${chalk.dim('Analyze against all eight pillars')}`);

    console.log(`  ${chalk.cyan('2.')} ${chalk.bold('Review Specific Pillar')}`);
    console.log(`      ${chalk.dim('Focus review on specific pillar(s)')}`);
    console.log(`      ${chalk.dim('Useful for targeted analysis')}`);

    console.log(`  ${chalk.cyan('3.')} ${chalk.bold('Security Scan')}`);
    console.log(`      ${chalk.dim('Perform security-focused review')}`);
    console.log(`      ${chalk.dim('Check for vulnerabilities and risks')}`);

    console.log(`  ${chalk.cyan('4.')} ${chalk.bold('Performance Review')}`);
    console.log(`      ${chalk.dim('Analyze performance characteristics')}`);
    console.log(`      ${chalk.dim('Identify bottlenecks and optimizations')}`);

    console.log(`  ${chalk.cyan('5.')} ${chalk.bold('Generate Report')}`);
    console.log(`      ${chalk.dim('Generate review report document')}`);
    console.log(`      ${chalk.dim('Save to session directory')}`);

    console.log(chalk.gray('═'.repeat(60)));

    console.log(chalk.dim('\nUse requirement-commands revise to check alignment.'));
    console.log(chalk.dim('Use requirement-commands bug-fix for any issues found.'));

    // Display review report template
    console.log(chalk.bold('\n📋 Code Review Report Template\n'));
    console.log(chalk.gray('═'.repeat(60)));

    const template = createReviewReportTemplate(metadata.sessionId);
    console.log(template);

    console.log(chalk.gray('═'.repeat(60)));

  } catch (error) {
    console.error(chalk.red('Error performing code review:'), error);
    throw error;
  }
}

/**
 * Get eight pillars of code review
 */
function getEightPillars(): IReviewPillar[] {
  return [
    {
      name: '🔧 Correctness',
      description: 'Code works as intended and meets requirements',
      checks: [
        'Functional requirements are met',
        'Edge cases are handled',
        'Error handling is proper',
        'Business logic is correct',
        'Data validation is in place',
      ],
    },
    {
      name: '📖 Readability',
      description: 'Code is easy to understand and maintain',
      checks: [
        'Variable names are meaningful',
        'Functions have clear purposes',
        'Code is self-documenting',
        'Comments explain complex logic',
        'Structure is logical',
      ],
    },
    {
      name: '🏗️ Architecture',
      description: 'Code follows good architectural principles',
      checks: [
        'Separation of concerns',
        'Proper abstraction levels',
        'Appropriate design patterns',
        'Modular structure',
        'Loose coupling, high cohesion',
      ],
    },
    {
      name: '🧪 Testability',
      description: 'Code can be easily tested',
      checks: [
        'Functions are pure where possible',
        'Dependencies are injectable',
        'Code is testable',
        'Test coverage is adequate',
        'Tests are meaningful',
      ],
    },
    {
      name: '🚀 Performance',
      description: 'Code performs efficiently',
      checks: [
        'Time complexity is optimal',
        'Space complexity is reasonable',
        'No unnecessary computations',
        'Efficient algorithms used',
        'Resource usage is optimized',
      ],
    },
    {
      name: '🔒 Security',
      description: 'Code is secure and follows security best practices',
      checks: [
        'Input validation is present',
        'Output encoding is applied',
        'Authentication/authorization is proper',
        'Sensitive data is protected',
        'Security vulnerabilities are addressed',
      ],
    },
    {
      name: '🔄 Maintainability',
      description: 'Code is easy to modify and extend',
      checks: [
        'Code is DRY (Don\'t Repeat Yourself)',
        'Changes are localized',
        'Configuration is separated',
        'Extensibility is supported',
        'Technical debt is minimal',
      ],
    },
    {
      name: '📚 Documentation',
      description: 'Code is well-documented',
      checks: [
        'API documentation is complete',
        'README is up-to-date',
        'Comments are accurate',
        'Examples are provided',
        'Changelog is maintained',
      ],
    },
  ];
}

/**
 * Create review report template
 */
function createReviewReportTemplate(sessionId: string): string {
  const date = new Date().toISOString();
  return `# Code Review Report

**Session:** ${sessionId}
**Review Date:** ${date}
**Reviewer:** [Reviewer Name]

## Executive Summary

[Brief summary of review findings]

## Overall Assessment

- **Overall Quality:** [excellent | good | fair | poor]
- **Critical Issues:** [number]
- **Major Issues:** [number]
- **Minor Issues:** [number]
- **Recommendations:** [approve | approve with changes | request changes]

## Eight Pillar Analysis

### 🔧 Correctness

**Status:** [pass | fail | partial]

**Findings:**
- [List correctness issues]

**Recommendations:**
- [List recommendations]

---

### 📖 Readability

**Status:** [pass | fail | partial]

**Findings:**
- [List readability issues]

**Recommendations:**
- [List recommendations]

---

### 🏗️ Architecture

**Status:** [pass | fail | partial]

**Findings:**
- [List architecture issues]

**Recommendations:**
- [List recommendations]

---

### 🧪 Testability

**Status:** [pass | fail | partial]

**Findings:**
- [List testability issues]

**Recommendations:**
- [List recommendations]

---

### 🚀 Performance

**Status:** [pass | fail | partial]

**Findings:**
- [List performance issues]

**Recommendations:**
- [List recommendations]

---

### 🔒 Security

**Status:** [pass | fail | partial]

**Findings:**
- [List security issues]

**Recommendations:**
- [List recommendations]

---

### 🔄 Maintainability

**Status:** [pass | fail | partial]

**Findings:**
- [List maintainability issues]

**Recommendations:**
- [List recommendations]

---

### 📚 Documentation

**Status:** [pass | fail | partial]

**Findings:**
- [List documentation issues]

**Recommendations:**
- [List recommendations]

---

## Alignment Verification

### Requirements Alignment

- [ ] All requirements are implemented
- [ ] Requirements are correctly interpreted
- [ ] No scope creep detected

**Notes:**
[Notes on requirements alignment]

### Design Alignment

- [ ] Design is followed correctly
- [ ] Design decisions are documented
- [ ] Deviations are justified

**Notes:**
[Notes on design alignment]

### Task Completion

- [ ] All tasks are completed
- [ ] Task quality is acceptable
- [ ] Task dependencies are satisfied

**Notes:**
[Notes on task completion]

---

## Critical Issues

| ID | Description | Severity | Location | Recommendation |
|----|-------------|-----------|-----------|----------------|
| [CRIT-001] | [Description] | critical | [file:line] | [Recommendation] |

---

## Major Issues

| ID | Description | Severity | Location | Recommendation |
|----|-------------|-----------|-----------|----------------|
| [MAJ-001] | [Description] | major | [file:line] | [Recommendation] |

---

## Minor Issues

| ID | Description | Severity | Location | Recommendation |
|----|-------------|-----------|-----------|----------------|
| [MIN-001] | [Description] | minor | [file:line] | [Recommendation] |

---

## Action Items

1. [ ] [Action item 1]
2. [ ] [Action item 2]
3. [ ] [Action item 3]

---

## Conclusion

[Summary of review and next steps]

---

**Reviewed Files:**
- [List of reviewed files]

**Review Duration:** [X hours]

**Next Review Date:** [Date]
`;
}
