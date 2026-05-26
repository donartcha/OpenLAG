import { Command } from 'commander';
import { parseOpenLagDocs, ParsedRelation, ParsedArtifact } from '../core/parser.js';
import { RelationRegistry } from '../../src/core/registry/RelationRegistry.js';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import yaml from 'js-yaml';

type ImpactEdge = {
  from: string;
  to: string;
  relation: string;
  direction: 'forward' | 'reverse' | 'both';
  weight: number;
  severity: 'low' | 'medium' | 'high';
};

type ImpactRecord = {
  id: string;
  type?: string;
  title?: string;
  reason: string;
  direction: 'forward' | 'reverse' | 'both';
  weight: number;
  severity: 'low' | 'medium' | 'high';
  owner: string | null;
  team: string | null;
};

export class ImpactGraph {
  public adj = new Map<string, ImpactEdge[]>();
  public artifacts = new Map<string, ParsedArtifact>();

  constructor(artifacts: ParsedArtifact[], relations: ParsedRelation[]) {
    for (const art of artifacts) {
      this.artifacts.set(art.id, art);
      this.adj.set(art.id, []);
    }

    for (const rel of relations) {
      const contract = RelationRegistry.getContract(rel.type);
      if (!contract) continue;
      
      const impactDef = contract.impact;
      if (!impactDef || !impactDef.propagates) continue;

      const directions = impactDef.directions || ['forward'];
      const weight = impactDef.weight || 1.0;

      if (directions.includes('forward') || directions.includes('both')) {
          this.addEdge(rel.from, rel.to, rel.type, 'forward', weight);
      }
      if (directions.includes('reverse') || directions.includes('both')) {
          this.addEdge(rel.to, rel.from, rel.type, 'reverse', weight);
      }
    }
  }

  private static severityFromWeight(weight: number): 'low' | 'medium' | 'high' {
    if (weight >= 0.8) return 'high';
    if (weight >= 0.5) return 'medium';
    return 'low';
  }

  private addEdge(from: string, to: string, relType: string, direction: 'forward' | 'reverse' | 'both', weight: number) {
      if (!this.adj.has(from)) return;
      this.adj.get(from)!.push({
        from,
        to,
        relation: relType,
        direction,
        weight,
        severity: ImpactGraph.severityFromWeight(weight),
      });
  }

  getImpactRecords(startId: string): ImpactRecord[] {
      const visited = new Set<string>();
      const queue = [startId];
      const best = new Map<string, ImpactRecord>();
      visited.add(startId);

      while (queue.length > 0) {
          const curr = queue.shift()!;
          const edges = this.adj.get(curr) || [];
          for (const edge of edges) {
              if (!visited.has(edge.to)) {
                  visited.add(edge.to);
                  queue.push(edge.to);
              }

              const art = this.artifacts.get(edge.to);
              const current = best.get(edge.to);
              if (!current || edge.weight > current.weight) {
                best.set(edge.to, {
                  id: edge.to,
                  type: art?.type,
                  title: art?.title,
                  reason: edge.relation,
                  direction: edge.direction,
                  weight: edge.weight,
                  severity: edge.severity,
                  owner: art?.ownership?.owner || null,
                  team: art?.ownership?.team || null,
                });
              }
          }
      }
      best.delete(startId);
      return Array.from(best.values()).sort((a, b) => {
        if (b.weight !== a.weight) return b.weight - a.weight;
        return a.id.localeCompare(b.id);
      });
  }
}

export function registerImpactCommand(program: Command) {
    program
    .command('impact')
    .description('Analyze impact based on Contract-Driven relations')
    .option('--artifact <id>', 'Analyze impact for a specific artifact ID')
    .option('--file <path>', 'Analyze impact for a file based on source path')
    .option('--from <ref>', 'Git base ref')
    .option('--to <ref>', 'Git target ref (default HEAD)')
    .option('--json', 'Output results in JSON format')
    .option('--fail-on-impact', 'Exit with code 2 when impacted artifacts are detected (CI mode)')
    .action((options) => {
        const data = parseOpenLagDocs(path.join(process.cwd(), 'docs'));
        const graph = new ImpactGraph(data.artifacts, data.relations);

        // Load rules
        const rulesDir = path.join(process.cwd(), 'docs', 'contracts', 'rules');
        const rules: any[] = [];
        if (fs.existsSync(rulesDir)) {
          const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.yaml'));
          for (const f of files) {
            try {
              const raw = fs.readFileSync(path.join(rulesDir, f), 'utf-8');
              const parsed = yaml.load(raw);
              if (parsed) rules.push(parsed);
            } catch (err) {
              console.warn(`Failed to parse rule ${f}:`, err);
            }
          }
        }

        let targetIds: string[] = [];

        if (options.artifact) {
            targetIds.push(options.artifact);
        } else if (options.file) {
            const artifact = data.artifacts.find(a => options.file.includes(a.file));
            if (artifact) targetIds.push(artifact.id);
        } else if (options.from) {
            const from = options.from;
            const to = options.to || 'HEAD';
            try {
                const diffOut = execSync(`git diff --name-only ${from} ${to}`, { encoding: 'utf-8' });
                const files = diffOut.split('\n').map(f => f.trim()).filter(f => f.length > 0 && f.endsWith('.md'));
                
                for (const file of files) {
                    const artifact = data.artifacts.find(a => file.includes(a.file) || a.file.includes(file));
                    if (artifact && !targetIds.includes(artifact.id)) {
                        targetIds.push(artifact.id);
                    }
                }
            } catch (err) {
                console.error('Failed to run git diff:', err);
                process.exit(1);
            }
        }

        if (targetIds.length === 0) {
            console.error('Please specify a valid --artifact, --file, or --from to evaluate impact.');
            process.exit(1);
        }

        const impactById = new Map<string, ImpactRecord>();
        for (const tId of targetIds) {
            if (!graph.artifacts.has(tId)) {
                console.error(`Warning: Artifact ${tId} not found in the parsed docs.`);
                continue;
            }
            const impacted = graph.getImpactRecords(tId);
            for (const item of impacted) {
              const art = graph.artifacts.get(item.id);
              if (art) {
                // Apply rules
                for (const rule of rules) {
                  if (rule.appliesTo && rule.appliesTo.includes(art.type)) {
                    if (rule.rule?.forbiddenDependency) {
                      const edges = data.relations.filter(r => r.from === art.id);
                      for (const edge of edges) {
                        const targetArt = graph.artifacts.get(edge.to);
                        if (targetArt && rule.rule.forbiddenDependency.includes(targetArt.type)) {
                          item.reason += ` [VIOLATION: ${rule.id} -> ${targetArt.type}]`;
                          if (rule.severity === 'high') item.severity = 'high';
                          item.weight = Math.max(item.weight, 1.0);
                        }
                      }
                    }
                  }
                }
              }

              const prev = impactById.get(item.id);
              if (!prev || item.weight > prev.weight || item.reason.includes('VIOLATION')) {
                impactById.set(item.id, item);
              }
            }
        }

        const impactedArr = Array.from(impactById.values()).sort((a, b) => {
          if (b.weight !== a.weight) return b.weight - a.weight;
          return a.id.localeCompare(b.id);
        });
        
        if (options.json) {
            console.log(JSON.stringify({
                targets: targetIds,
                impactedArtifacts: impactedArr
            }, null, 2));
        } else {
            console.log(`# Impact Analysis for ${targetIds.join(', ')}`);
            console.log(`\nBased on the contract-driven relation propagation rules, ${impactedArr.length} artifacts are potentially impacted.`);
            
            if (impactedArr.length > 0) {
                console.log('\n## Impacted Artifacts');
                impactedArr.forEach((item) => {
                    console.log(`- **${item.id}** (${item.type}): ${item.title}`);
                    console.log(`  reason=${item.reason} direction=${item.direction} weight=${item.weight.toFixed(2)} severity=${item.severity} owner=${item.owner || '-'} team=${item.team || '-'}`);
                });
            } else {
                console.log('\nNo propagated impact detected.');
            }
        }

        if (options.failOnImpact && impactedArr.length > 0) {
          process.exit(2);
        }
    });
}
