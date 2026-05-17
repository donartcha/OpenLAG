export interface GapIssue {
    artifact: any;
    type: string;
    message: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export function generateGapsReport(gaps: GapIssue[], isFiltered: boolean): string {
    const total = gaps.length;
    const critical = gaps.filter(g => g.severity === 'HIGH').length;
    const warning = gaps.filter(g => g.severity === 'MEDIUM').length;
    const info = gaps.filter(g => g.severity === 'LOW').length;

    let content = `# OpenLAG GAPs Report

Generated at: ${new Date().toISOString()}

Scope: ${isFiltered ? 'filtered' : 'all'}

## Summary

- Total issues: ${total}
- Critical: ${critical}
- Warning: ${warning}
- Info: ${info}

## Issues

`;

    if (total === 0) {
        content += `*No GAPs found for the current exact filters. Great job!*\n`;
        return content;
    }

    gaps.forEach((gap, index) => {
        const art = gap.artifact;
        content += `### ${index + 1}. ${art.id} — ${gap.severity}\n\n`;
        content += `- Artifact: ${art.title || 'Untitled'}\n`;
        content += `- Type: ${art.type}\n`;
        if (art.status) content += `- Status: ${art.status}\n`;
        content += `- Relation: N/A\n`;
        content += `- Reason: ${gap.message}\n\n`;
    });

    return content;
}

export function downloadTextFile(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
