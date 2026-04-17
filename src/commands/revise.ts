/**
 * Revise Command
 * Check if code aligns with requirements, design, and implementation blueprints
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
 * Alignment check interface
 */
interface IAlignmentCheck {
  category: string;
  description: string;
  checks: string[];
}

/**
 * Check if code aligns with requirements, design, and implementation blueprints
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
    console.log(chalk.bold('\n🔍 Alignment Verification\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`${chalk.blue('Session:')} ${metadata.sessionId}`);
    console.log(`${chalk.blue('Current Phase:')} ${metadata.phase}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Read required documents
    const requirementsPath = path.join(fullSessionPath, '06-requirements-spec.md');
    const designPath = path.join(fullSessionPath, '07-design.md');
    const tasksPath = path.join(fullSessionPath, '08-tasks.md');

    // Check document existence
    console.log(chalk.bold('\n📁 Document Status\n'));
    console.log(chalk.gray('─'.repeat(60)));

    const requirementsExists = exists(requirementsPath);
    const designExists = exists(designPath);
    const tasksExists = exists(tasksPath);

    console.log(`${requirementsExists ? '✅' : '❌'} 06-requirements-spec.md`);
    console.log(`${designExists ? '✅' : '❌'} 07-design.md`);
    console.log(`${tasksExists ? '✅' : '❌'} 08-tasks.md`);

    console.log(chalk.gray('─'.repeat(60)));

    if (!requirementsExists || !designExists || !tasksExists) {
      console.log(chalk.yellow('\nSome required documents are missing.'));
      console.log(chalk.dim('Run: requirement-commands specs-generate'));
      return;
    }

    // Display alignment checks
    const checks = getAlignmentChecks();

    console.log(chalk.bold('\n🏛️ Alignment Checks\n'));
    console.log(chalk.gray('═'.repeat(60)));

    for (const check of checks) {
      console.log(`${chalk.bold(check.category)}: ${check.description}`);
      console.log(chalk.dim('Checks:'));
      for (const item of check.checks) {
        console.log(chalk.dim(`  - ${item}`));
      }
      console.log('');
    }

    console.log(chalk.gray('═'.repeat(60)));

    // Display alignment verification workflow
    console.log(chalk.bold('\n⚙️ Alignment Verification Workflow\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`  ${chalk.cyan('1.')} ${chalk.bold('Read Source Documents')}`);
    console.log(`      ${chalk.dim('Read requirements, design, and tasks')}`);
    console.log(`      ${chalk.dim('Understand the intended implementation')}`);

    console.log(`  ${chalk.cyan('2.')} ${chalk.bold('Analyze Implementation')}`);
    console.log(`      ${chalk.dim('Review actual code implementation')}`);
    console.log(`      ${chalk.dim('Identify deviations from design')}`);

    console.log(`  ${chalk.cyan('3.')} ${chalk.bold('Trace Requirements')}`);
    console.log(`      ${chalk.dim('Trace each requirement to implementation')}`);
    console.log(`      ${chalk.dim('Verify all requirements are met')}`);

    console.log(`  ${chalk.cyan('4.')} ${chalk.bold('Identify Drift')}`);
    console.log(`      ${chalk.dim('Identify requirement drift')}`);
    console.log(`      ${chalk.dim('Identify design drift')}`);
    console.log(`      ${chalk.dim('Identify task drift')}`);

    console.log(`  ${chalk.cyan('5.')} ${chalk.bold('Generate Report')}`);
    console.log(`      ${chalk.dim('Generate alignment report')}`);
    console.log(`      ${chalk.dim('Document findings and recommendations')}`);

    console.log(chalk.gray('═'.repeat(60)));

    // Display alignment verification options
    console.log(chalk.bold('\n📝 Alignment Verification Options\n'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(`  ${chalk.cyan('1.')} ${chalk.bold('Start Alignment Check')}`);
    console.log(`      ${chalk.dim('Perform comprehensive alignment verification')}`);
    console.log(`      ${chalk.dim('Compare implementation with all documents')}`);

    console.log(`  ${chalk.cyan('2.')} ${chalk.bold('Check Requirements Alignment')}`);
    console.log(`      ${chalk.dim('Verify implementation meets requirements')}`);
    console.log(`      ${chalk.dim('Trace requirements to code')}`);

    console.log(`  ${chalk.cyan('3.')} ${chalk.bold('Check Design Alignment')}`);
    console.log(`      ${chalk.dim('Verify implementation follows design')}`);
    console.log(`      ${chalk.dim('Check architecture and patterns')}`);

    console.log(`  ${chalk.cyan('4.')} ${chalk.bold('Check Task Alignment')}`);
    console.log(`      ${chalk.dim('Verify all tasks are complete')}`);
    console.log(`      ${chalk.dim('Check task quality')}`);

    console.log(`  ${chalk.cyan('5.')} ${chalk.bold('Generate Alignment Report')}`);
    console.log(`      ${chalk.dim('Generate comprehensive report')}`);
    console.log(`      ${chalk.dim('Save to session directory')}`);

    console.log(chalk.gray('═'.repeat(60)));

    console.log(chalk.dim('\nUse requirement-commands code-review for quality analysis.'));
    console.log(chalk.dim('Use requirement-commands bug-fix for any issues found.'));

    // Display alignment report template
    console.log(chalk.bold('\n📋 Alignment Report Template\n'));
    console.log(chalk.gray('═'.repeat(60)));

    const template = createAlignmentReportTemplate(metadata.sessionId);
    console.log(template);

    console.log(chalk.gray('═'.repeat(60)));

  } catch (error) {
    console.error(chalk.red('Error verifying alignment:'), error);
    throw error;
  }
}

/**
 * Get alignment checks
 */
function getAlignmentChecks(): IAlignmentCheck[] {
  return [
    {
      category: '📋 Requirements Alignment',
      description: 'Verify implementation meets all requirements',
      checks: [
        'All functional requirements are implemented',
        'All non-functional requirements are met',
        'Requirements are correctly interpreted',
        'No scope creep detected',
        'Requirements are fully tested',
      ],
    },
    {
      category: '🏗️ Design Alignment',
      description: 'Verify implementation follows design',
      checks: [
        'Architecture matches design',
        'Design patterns are followed',
        'Component structure is correct',
        'Data models match design',
        'API contracts are honored',
      ],
    },
    {
      category: '📝 Task Alignment',
      description: 'Verify all tasks are completed',
      checks: [
        'All tasks are implemented',
        'Task quality is acceptable',
        'Task dependencies are satisfied',
        'Task acceptance criteria are met',
        'Tasks are properly documented',
      ],
    },
    {
      category: '🔍 Drift Detection',
      description: 'Identify any drift from original plans',
      checks: [
        'Requirement drift identified',
        'Design drift identified',
        'Task drift identified',
        'Scope changes documented',
        'Drift impact assessed',
      ],
    },
    {
      category: '🔗 Traceability',
      description: 'Verify traceability across documents',
      checks: [
        'Requirements trace to design',
        'Design traces to tasks',
        'Tasks trace to implementation',
        'Bidirectional traceability verified',
        'Traceability matrix is complete',
      ],
    },
  ];
}

/**
 * Create alignment report template
 */
function createAlignmentReportTemplate(sessionId: string): string {
  const date = new Date().toISOString();
  return `# Alignment Verification Report

**Session:** ${sessionId}
**Review Date:** ${date}
**Reviewer:** [Reviewer Name]

## Executive Summary

[Brief summary of alignment verification findings]

## Overall Assessment

- **Requirements Alignment:** [aligned | partial | misaligned]
- **Design Alignment:** [aligned | partial | misaligned]
- **Task Alignment:** [aligned | partial | misaligned]
- **Overall Alignment:** [excellent | good | fair | poor]
- **Drift Detected:** [yes | no]

## Document Status

| Document | Status | Last Updated | Notes |
|----------|--------|-------------|-------|
| 06-requirements-spec.md | [exists | missing] | [date] | [notes] |
| 07-design.md | [exists | missing] | [date] | [notes] |
| 08-tasks.md | [exists | missing] | [date] | [notes] |

---

## Requirements Alignment

### Functional Requirements

| Requirement ID | Description | Status | Location | Notes |
|---------------|-------------|--------|----------|-------|
| [REQ-001] | [Description] | [implemented | partial | missing] | [file:line] | [notes] |
| [REQ-002] | [Description] | [implemented | partial | missing] | [file:line] | [notes] |

**Summary:**
- [ ] All functional requirements are implemented
- [ ] Requirements are correctly interpreted
- [ ] No scope creep detected

**Findings:**
[List findings]

---

### Non-Functional Requirements

| Requirement ID | Description | Status | Notes |
|---------------|-------------|--------|-------|
| [NFR-001] | [Description] | [met | partial | not met] | [notes] |
| [NFR-002] | [Description] | [met | partial | not met] | [notes] |

**Summary:**
- [ ] Performance requirements are met
- [ ] Security requirements are met
- [ ] Scalability requirements are met
- [ ] Maintainability requirements are met

**Findings:**
[List findings]

---

## Design Alignment

### Architecture

| Design Element | Description | Status | Notes |
|----------------|-------------|--------|-------|
| [Element 1] | [Description] | [implemented | partial | missing] | [notes] |
| [Element 2] | [Description] | [implemented | partial | missing] | [notes] |

**Summary:**
- [ ] Architecture matches design
- [ ] Design patterns are followed
- [ ] Component structure is correct

**Findings:**
[List findings]

---

### Data Models

| Model | Description | Status | Notes |
|-------|-------------|--------|-------|
| [Model 1] | [Description] | [implemented | partial | missing] | [notes] |
| [Model 2] | [Description] | [implemented | partial | missing] | [notes] |

**Summary:**
- [ ] Data models match design
- [ ] Relationships are correct
- [ ] Schema is consistent

**Findings:**
[List findings]

---

### API Contracts

| API Endpoint | Description | Status | Notes |
|--------------|-------------|--------|-------|
| [Endpoint 1] | [Description] | [implemented | partial | missing] | [notes] |
| [Endpoint 2] | [Description] | [implemented | partial | missing] | [notes] |

**Summary:**
- [ ] API contracts are honored
- [ ] Request/response formats match
- [ ] Error handling is consistent

**Findings:**
[List findings]

---

## Task Alignment

| Task ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| [Task 1] | [Description] | [complete | partial | incomplete] | [notes] |
| [Task 2] | [Description] | [complete | partial | incomplete] | [notes] |

**Summary:**
- [ ] All tasks are implemented
- [ ] Task quality is acceptable
- [ ] Task dependencies are satisfied
- [ ] Acceptance criteria are met

**Findings:**
[List findings]

---

## Drift Detection

### Requirement Drift

| Drift ID | Original | Current | Impact | Recommendation |
|----------|----------|---------|---------|----------------|
| [DRIFT-001] | [Original requirement] | [Current state] | [low | medium | high] | [Recommendation] |

**Summary:**
- [ ] Requirement drift identified
- [ ] Scope changes documented
- [ ] Impact is assessed

**Findings:**
[List findings]

---

### Design Drift

| Drift ID | Original | Current | Impact | Recommendation |
|----------|----------|---------|---------|----------------|
| [DRIFT-002] | [Original design] | [Current state] | [low | medium | high] | [Recommendation] |

**Summary:**
- [ ] Design drift identified
- [ ] Architecture changes documented
- [ ] Impact is assessed

**Findings:**
[List findings]

---

### Task Drift

| Drift ID | Original | Current | Impact | Recommendation |
|----------|----------|---------|---------|----------------|
| [DRIFT-003] | [Original task] | [Current state] | [low | medium | high] | [Recommendation] |

**Summary:**
- [ ] Task drift identified
- [ ] Task changes documented
- [ ] Impact is assessed

**Findings:**
[List findings]

---

## Traceability Matrix

| Requirement | Design Element | Task | Implementation | Status |
|-------------|---------------|-------|----------------|--------|
| [REQ-001] | [Design Element] | [Task ID] | [file:line] | [traceable | missing] |
| [REQ-002] | [Design Element] | [Task ID] | [file:line] | [traceable | missing] |

**Summary:**
- [ ] Requirements trace to design
- [ ] Design traces to tasks
- [ ] Tasks trace to implementation
- [ ] Bidirectional traceability verified

**Findings:**
[List findings]

---

## Recommendations

### High Priority

1. [ ] [High priority recommendation 1]
2. [ ] [High priority recommendation 2]

### Medium Priority

1. [ ] [Medium priority recommendation 1]
2. [ ] [Medium priority recommendation 2]

### Low Priority

1. [ ] [Low priority recommendation 1]
2. [ ] [Low priority recommendation 2]

---

## Action Items

1. [ ] [Action item 1]
2. [ ] [Action item 2]
3. [ ] [Action item 3]

---

## Conclusion

[Summary of alignment verification and next steps]

---

**Reviewed Files:**
- [List of reviewed files]

**Review Duration:** [X hours]

**Next Review Date:** [Date]
`;
}
