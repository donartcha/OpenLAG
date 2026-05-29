// AUTO-GENERATED FILE. DO NOT EDIT.
// Run 'npm run generate-rules' to update this file based on docs/contracts/rules/*.yaml

export interface RuleContract {
  id: string;
  description: string;
  severity: "error" | "warn" | "warning" | "info";
  matchNode?: {
    type?: string | string[];
    layer?: string | string[];
  };
  conditions?: {
    requiredRelations?: {
      type: string;
      direction?: "outgoing" | "incoming" | "both";
      toType?: string | string[];
      toLayer?: string | string[];
      message?: string;
    }[];
    forbiddenRelations?: {
      type: string;
      direction?: "outgoing" | "incoming" | "both";
      toType?: string | string[];
      toLayer?: string | string[];
      message?: string;
    }[];
    allowedLayers?: string[];
    requiredFields?: string[];
  };
}

export const generatedRules: RuleContract[] = [
  {
    "id": "codeWithoutRequirement",
    "description": "Code entity has no requirement associated.",
    "severity": "error",
    "matchNode": {
      "type": "CODE_ENTITY"
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "IMPLEMENTS",
          "toType": [
            "REQUIREMENT",
            "FEATURE",
            "BUG",
            "API"
          ],
          "message": "Code entity has no requirement associated."
        }
      ]
    }
  },
  {
    "id": "requirementWithoutImplementation",
    "description": "Requirement lacks implementation.",
    "severity": "error",
    "matchNode": {
      "type": [
        "REQUIREMENT",
        "FEATURE",
        "USE_CASE"
      ]
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "IMPLEMENTS",
          "direction": "incoming",
          "message": "Requirement lacks implementation."
        }
      ]
    }
  },
  {
    "id": "requirementWithoutTest",
    "description": "Requirement has no tests linked.",
    "severity": "error",
    "matchNode": {
      "type": [
        "REQUIREMENT",
        "FEATURE",
        "USE_CASE"
      ]
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "TESTS",
          "direction": "incoming",
          "message": "Requirement has no tests linked."
        }
      ]
    }
  }
];
