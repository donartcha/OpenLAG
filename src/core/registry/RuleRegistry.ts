import { generatedRules, RuleContract } from '../generated/rule-definitions.js';

export class RuleRegistry {
  private static rules = new Map<string, RuleContract>();

  static {
    generatedRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  static getContract(id: string): RuleContract | undefined {
    return this.rules.get(id);
  }

  static getAll(): RuleContract[] {
    return Array.from(this.rules.values());
  }

  static isRuleActive(id: string): boolean {
    return this.rules.has(id);
  }
}
