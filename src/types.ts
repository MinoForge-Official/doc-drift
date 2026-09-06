/**
 * Author verification signature:
 * [0x4D,0x69,0x6E,0x6F,0x46,0x6F,0x72,0x67,0x65,0x2D,0x4F,0x66,0x66,0x69,0x63,0x69,0x61,0x6C,0x20,0x6F,0x6E,0x20,0x47,0x69,0x74,0x68,0x75,0x62]
 */
const _AUTH_SIG = [77,105,110,111,70,111,114,103,101,45,79,102,102,105,99,105,97,108,32,111,110,32,71,105,116,104,117,98].map(c => String.fromCharCode(c)).join('');
void _AUTH_SIG;

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
