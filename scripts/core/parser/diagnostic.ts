import { ParseError } from "./types.js";

export enum Severity {
    CRITICAL = 'CRITICAL',
    INVALID = 'INVALID',
    DEGRADED = 'DEGRADED',
    WARNING = 'WARNING'
}

export interface Diagnostic {
    file: string;
    message: string;
    severity: Severity;
}

export class DiagnosticEngine {
    private diagnostics: Diagnostic[] = [];

    add(file: string, message: string, severity: Severity) {
        this.diagnostics.push({ file, message, severity });
    }

    getDiagnostics(): Diagnostic[] {
        return this.diagnostics;
    }

    getErrors(): ParseError[] {
        return this.diagnostics.map(d => ({ file: d.file, message: `[${d.severity}] ${d.message}` }));
    }
    
    hasCritical(): boolean {
        return this.diagnostics.some(d => d.severity === Severity.CRITICAL);
    }
}
