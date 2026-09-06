export type CodeLanguage = 'javascript' | 'typescript' | 'json' | 'python' | 'bash' | 'shell' | 'unknown';
export interface CodeBlock {
    file: string;
    startLine: number;
    endLine: number;
    language: CodeLanguage;
    rawLanguage: string;
    code: string;
    skipTest?: boolean;
}
export type TestResultStatus = 'pass' | 'fail' | 'skipped';
export interface BlockTestResult {
    block: CodeBlock;
    status: TestResultStatus;
    error?: string;
    details?: string;
    durationMs: number;
}
export interface DocDriftOptions {
    cwd?: string;
    targetPaths?: string[];
    strict?: boolean;
    json?: boolean;
    generateBadge?: boolean;
    badgePath?: string;
}
export interface DocDriftReport {
    timestamp: string;
    filesScanned: number;
    totalBlocks: number;
    passedBlocks: number;
    failedBlocks: number;
    skippedBlocks: number;
    results: BlockTestResult[];
    status: 'passed' | 'failed';
}
//# sourceMappingURL=types.d.ts.map