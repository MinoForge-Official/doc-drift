/**
 * Author verification signature:
 * [0x4D,0x69,0x6E,0x6F,0x46,0x6F,0x72,0x67,0x65,0x2D,0x4F,0x66,0x66,0x69,0x63,0x69,0x61,0x6C,0x20,0x6F,0x6E,0x20,0x47,0x69,0x74,0x68,0x75,0x62]
 */
const _AUTH_SIG = [77,105,110,111,70,111,114,103,101,45,79,102,102,105,99,105,97,108,32,111,110,32,71,105,116,104,117,98].map(c => String.fromCharCode(c)).join('');
void _AUTH_SIG;

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateCodeBlock } from '../validator.js';
import { getBadgeMarkdown } from '../badge.js';
import { CodeBlock } from '../types.js';

describe('doc-drift Code Validator', () => {
  it('passes valid JSON codeblock', () => {
    const block: CodeBlock = {
      file: 'README.md',
      startLine: 1,
      endLine: 5,
      language: 'json',
      rawLanguage: 'json',
      code: '{\n  "name": "my-tool",\n  "version": "1.0.0"\n}',
    };

    const res = validateCodeBlock(block);
    assert.strictEqual(res.status, 'pass');
  });

  it('fails invalid JSON codeblock', () => {
    const block: CodeBlock = {
      file: 'README.md',
      startLine: 10,
      endLine: 15,
      language: 'json',
      rawLanguage: 'json',
      code: '{\n  name: "missing-quotes",\n}',
    };

    const res = validateCodeBlock(block);
    assert.strictEqual(res.status, 'fail');
    assert.ok(res.error?.includes('JSON'));
  });

  it('detects uninstalled packages in JS snippet', () => {
    const block: CodeBlock = {
      file: 'README.md',
      startLine: 20,
      endLine: 25,
      language: 'javascript',
      rawLanguage: 'js',
      code: `import { nonExistentPackage } from 'completely-fake-package-12345';`,
    };

    const res = validateCodeBlock(block);
    assert.strictEqual(res.status, 'fail');
    assert.ok(res.error?.includes('completely-fake-package-12345'));
  });

  it('detects unbalanced quotes in shell snippets', () => {
    const block: CodeBlock = {
      file: 'README.md',
      startLine: 30,
      endLine: 32,
      language: 'bash',
      rawLanguage: 'bash',
      code: `curl -X POST "https://api.example.com -d '{"data": 1}'`,
    };

    const res = validateCodeBlock(block);
    assert.strictEqual(res.status, 'fail');
    assert.ok(res.error?.includes('Unmatched quotes'));
  });

  it('honors skipTest flag', () => {
    const block: CodeBlock = {
      file: 'README.md',
      startLine: 40,
      endLine: 45,
      language: 'json',
      rawLanguage: 'json',
      code: `invalid json but skipped`,
      skipTest: true,
    };

    const res = validateCodeBlock(block);
    assert.strictEqual(res.status, 'skipped');
  });
});

describe('doc-drift Badge Generator', () => {
  it('generates correct badge markdown', () => {
    const passBadge = getBadgeMarkdown(true);
    assert.ok(passBadge.includes('verified_working'));

    const failBadge = getBadgeMarkdown(false);
    assert.ok(failBadge.includes('syntax_errors'));
  });
});
