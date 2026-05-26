// AUTO-GENERATED FILE. DO NOT EDIT.
// Run 'npm run generate-rules' to update this file based on docs/contracts/rules/*.yaml

export interface RuleContract {
  id: string;
  description: string;
  severity: "error" | "warn" | "info";
  matchNode?: {
    type?: string | string[];
    layer?: string | string[];
  };
  conditions?: {
    requiredRelations?: {
      type: string;
      toType?: string | string[];
      toLayer?: string | string[];
      message?: string;
    }[];
    forbiddenRelations?: {
      type: string;
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
            "EPIC",
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
    "id": "invalidLayerRelation",
    "description": "Business layer artifact should not have OPERATIONAL relations.",
    "severity": "error",
    "matchNode": {
      "layer": "BUSINESS"
    },
    "conditions": {
      "forbiddenRelations": [
        {
          "type": "DEPLOYS",
          "message": "Business layer artifact should not have OPERATIONAL relations."
        },
        {
          "type": "MONITORS",
          "message": "Business layer artifact should not have OPERATIONAL relations."
        }
      ]
    }
  },
  {
    "id": "orphanArtifact",
    "description": "Test without associated requirement.",
    "severity": "error",
    "matchNode": {
      "type": "TEST_CASE"
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "TESTS",
          "toType": [
            "CODE_ENTITY",
            "REQUIREMENT",
            "FEATURE",
            "BUG",
            "USE_CASE"
          ],
          "message": "Test without associated requirement."
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
        "EPIC",
        "FEATURE",
        "USE_CASE"
      ]
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "IMPLEMENTS",
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
        "EPIC",
        "FEATURE",
        "USE_CASE"
      ]
    },
    "conditions": {
      "requiredRelations": [
        {
          "type": "TESTS",
          "message": "Requirement has no tests linked."
        }
      ]
    }
  }
];
