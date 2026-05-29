import { z } from "zod";

export const ArtifactSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  version: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'in_progress', 'ready', 'closed', 'deprecated']).optional(),
  layer: z.string().optional(),
  ownership: z.object({
    owner: z.string().optional(),
    team: z.string().optional(),
    domain: z.string().optional(),
    maintainers: z.array(z.string()).optional(),
    reviewers: z.array(z.string()).optional(),
    steward: z.string().optional(),
  }).optional(),
  file: z.string(),
});
