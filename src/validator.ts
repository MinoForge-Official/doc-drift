import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { CodeBlock, BlockTestResult } from './types.js';

const NODE_BUILTINS = new Set([
  'assert', 'buffer', 'child_process', 'crypto', 'events', 'fs',
  'fs/promises', 'http', 'https', 'net', 'os', 'path', 'process',
  'stream', 'url', 'util', 'zlib', 'test'
]);

function getInstalledDependencies(cwd: string): Set<string> {
  const deps = new Set<string>();
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
        if (pkg[key]) {
          for (const dep of Object.keys(pkg[key])) {
            deps.add(dep);
          }
        }
      }
      if (pkg.name) {
        deps.add(pkg.name);
      }
    } catch {
      // Ignore
    }
  }
  return deps;
}

export function validateCodeBlock(block: CodeBlock, cwd = process.cwd()): BlockTestResult {
  const startTime = Date.now();

  if (block.skipTest) {
    return {
      block,
      status: 'skipped',
      durationMs: 0,
    };
  }

  // 1. JSON Validation
  if (block.language === 'json') {
    try {
      JSON.parse(block.code);
      return {
        block,
        status: 'pass',
        durationMs: Date.now() - startTime,
      };
    } catch (err) {
      return {
        block,
        status: 'fail',
        error: err instanceof Error ? err.message : String(err),
        details: 'Invalid JSON syntax in documentation code snippet',
        durationMs: Date.now() - startTime,
      };
    }
  }

  // 2. JS / TS Validation
  if (block.language === 'javascript' || block.language === 'typescript') {
    // Check imports first
    const installedDeps = getInstalledDependencies(cwd);
    const importRegex = /(?:import\s+(?:[\w*\s{},]*\s+from\s+)?|require\s*\(\s*)['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(block.code)) !== null) {
      const specifier = match[1];
      if (!specifier.startsWith('.') && !specifier.startsWith('/') && !specifier.startsWith('node:')) {
        const pkg = specifier.startsWith('@') 
          ? specifier.split('/').slice(0, 2).join('/') 
          : specifier.split('/')[0];

        if (!NODE_BUILTINS.has(pkg) && !installedDeps.has(pkg)) {
          return {
            block,
            status: 'fail',
            error: `Broken import: package "${pkg}" is used in README example but not installed in package.json`,
            details: `Users copying this example will encounter "Cannot find module '${pkg}'"`,
            durationMs: Date.now() - startTime,
          };
        }
      }
    }

    // Syntax check for JS (strip TS type notations roughly for basic script validation)
    try {
      const codeForSyntax = block.code
        .replace(/:\s*[A-Z][a-zA-Z0-9_<>[\]|&,\s]*(?=[=;,)\n])/g, '') // strip simple type annotations
        .replace(/as\s+[A-Z][a-zA-Z0-9_<>[\]|&]*/g, '')
        .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '')
        .replace(/type\s+\w+\s*=[\s\S]*?;/g, '')
        .replace(/^import\s+type\s+.*$/gm, '')
        .replace(/^import\s+.*$/gm, '')
        .replace(/^export\s+.*$/gm, '');

      new vm.Script(codeForSyntax);
      return {
        block,
        status: 'pass',
        durationMs: Date.now() - startTime,
      };
    } catch (err) {
      // Syntax errors in JS
      return {
        block,
        status: 'fail',
        error: err instanceof Error ? err.message : String(err),
        details: 'Syntax error detected in JavaScript/TypeScript code example',
        durationMs: Date.now() - startTime,
      };
    }
  }

  // 3. Bash / Shell validation
  if (block.language === 'bash' || block.language === 'shell') {
    // Check for unmatched quotes or basic syntax blunders
    const singleQuotes = (block.code.match(/'/g) || []).length;
    const doubleQuotes = (block.code.match(/"/g) || []).length;
    const backticks = (block.code.match(/`/g) || []).length;

    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0 || backticks % 2 !== 0) {
      return {
        block,
        status: 'fail',
        error: 'Unmatched quotes or backticks detected in shell command snippet',
        durationMs: Date.now() - startTime,
      };
    }

    return {
      block,
      status: 'pass',
      durationMs: Date.now() - startTime,
    };
  }

  // 4. Python validation
  if (block.language === 'python') {
    const lines = block.code.split('\n');
    let openParens = 0;
    let openBrackets = 0;
    let openBraces = 0;

    for (const line of lines) {
      for (const char of line) {
        if (char === '(') openParens++;
        if (char === ')') openParens--;
        if (char === '[') openBrackets++;
        if (char === ']') openBrackets--;
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
      }
    }

    if (openParens !== 0 || openBrackets !== 0 || openBraces !== 0) {
      return {
        block,
        status: 'fail',
        error: 'Unbalanced brackets or parentheses in Python documentation snippet',
        durationMs: Date.now() - startTime,
      };
    }

    return {
      block,
      status: 'pass',
      durationMs: Date.now() - startTime,
    };
  }

  return {
    block,
    status: 'pass',
    durationMs: Date.now() - startTime,
  };
}
