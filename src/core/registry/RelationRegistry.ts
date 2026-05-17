import { RelationContract, GENERATED_RELATIONS } from '../generated/relation-definitions.js';

export class RelationRegistry {
  private static relationsMap = new Map<string, RelationContract>(
    GENERATED_RELATIONS.map(rel => [rel.type, rel])
  );

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
    return GENERATED_RELATIONS.filter(rel => rel.category === category);
  }

  static getAllContracts(): RelationContract[] {
    return GENERATED_RELATIONS;
  }
}
