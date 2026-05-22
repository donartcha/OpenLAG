import { RelationContract, GENERATED_RELATIONS } from '../generated/relation-definitions.js';

export type { RelationContract };

export class RelationRegistry {
  private static relationsMap = new Map<string, RelationContract>(
    GENERATED_RELATIONS.map(rel => [rel.type, rel])
  );

  static configure(contracts: RelationContract[]): void {
    this.relationsMap = new Map<string, RelationContract>(
      contracts.filter(rel => rel.type).map(rel => [rel.type, rel])
    );
  }

  static getValidTypes(): string[] {
    return Array.from(this.relationsMap.keys());
  }

  static getContract(type: string): RelationContract | undefined {
    return this.relationsMap.get(type);
  }

  static isValid(type: string): boolean {
    return this.relationsMap.has(type);
  }

  static getRelationsByCategory(category: string): RelationContract[] {
    return Array.from(this.relationsMap.values()).filter(rel => rel.category === category);
  }

  static getAllContracts(): RelationContract[] {
    return Array.from(this.relationsMap.values());
  }
}
