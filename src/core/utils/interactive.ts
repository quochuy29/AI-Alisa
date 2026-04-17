/**
 * Interactive Prompts
 * Provides helper functions for user interaction using Inquirer.js
 */

import { input, confirm, select } from '@inquirer/prompts';

/**
 * Prompt user for text input
 */
export async function askInput(question: string, defaultValue?: string): Promise<string> {
  const answer = await input({
    message: question,
    default: defaultValue,
  });
  return answer;
}

/**
 * Prompt user for confirmation (yes/no)
 */
export async function askConfirm(question: string, defaultValue: boolean = false): Promise<boolean> {
  const answer = await confirm({
    message: question,
    default: defaultValue,
  });
  return answer;
}

/**
 * Prompt user to select from a list of options
 */
export async function askSelect<T extends string>(
  question: string,
  choices: { name: string; value: T }[],
  defaultValue?: T
): Promise<T> {
  const answer = await select({
    message: question,
    choices,
    default: defaultValue,
  });
  return answer;
}

/**
 * Prompt user for a required field
 */
export async function askRequiredInput(question: string, fieldName: string = 'This field'): Promise<string> {
  let answer = await askInput(question);
  while (!answer.trim()) {
    answer = await askInput(`${fieldName} is required. Please enter a value:`);
  }
  return answer;
}
