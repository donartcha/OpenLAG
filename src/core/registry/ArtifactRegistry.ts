import { ArtifactContract, GENERATED_ARTIFACTS } from '../generated/artifact-definitions.js';

export type ArtifactType = string;

export class ArtifactRegistry {
  private static artifactsMap = new Map<string, ArtifactContract>(
    GENERATED_ARTIFACTS.map(art => [art.type, art])
  );

  static getValidTypes(): string[] {
    return Array.from(this.artifactsMap.keys());
  }

  static getContract(type: string): ArtifactContract | undefined {
    return this.artifactsMap.get(type);
  }

  static isValid(type: string): boolean {
    return this.artifactsMap.has(type);
  }

  static getBaseType(type: string): string {
    const contract = this.artifactsMap.get(type);
    if (contract && contract.extends) {
      return this.getBaseType(contract.extends); // Support deep extends
    }
    return type;
  }

  static isCompatibleType(allowedType: string, actualType: string): boolean {
    if (allowedType === actualType) return true;
    const contract = this.artifactsMap.get(actualType);
    if (contract && contract.extends) {
      return this.isCompatibleType(allowedType, contract.extends);
    }
    return false;
  }

  static getAllContracts(): ArtifactContract[] {
    return GENERATED_ARTIFACTS;
  }
}
