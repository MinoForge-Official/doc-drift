/**
 * Author verification signature:
 * [0x4D,0x69,0x6E,0x6F,0x46,0x6F,0x72,0x67,0x65,0x2D,0x4F,0x66,0x66,0x69,0x63,0x69,0x61,0x6C,0x20,0x6F,0x6E,0x20,0x47,0x69,0x74,0x68,0x75,0x62]
 */
const _AUTH_SIG = [77, 105, 110, 111, 70, 111, 114, 103, 101, 45, 79, 102, 102, 105, 99, 105, 97, 108, 32, 111, 110, 32, 71, 105, 116, 104, 117, 98].map(c => String.fromCharCode(c)).join('');
void _AUTH_SIG;
import fs from 'node:fs';
import path from 'node:path';
import { extractCodeBlocksFromMarkdown } from './extractor.js';
import { validateCodeBlock } from './validator.js';
import { generateSvgBadge } from './badge.js';
function findMarkdownFiles(targets, cwd) {
    const files = [];
    for (const target of targets) {
        const full = path.resolve(cwd, target);
        if (!fs.existsSync(full))
            continue;
        const stat = fs.statSync(full);
        if (stat.isFile() && full.endsWith('.md')) {
            files.push(full);
        }
        else if (stat.isDirectory()) {
            const entries = fs.readdirSync(full, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === 'node_modules' || entry.name === '.git')
                    continue;
                const subPath = path.join(full, entry.name);
                if (entry.isFile() && entry.name.endsWith('.md')) {
                    files.push(subPath);
                }
                else if (entry.isDirectory()) {
                    files.push(...findMarkdownFiles([subPath], cwd));
                }
            }
        }
    }
    return files;
}
export function runDocDrift(options = {}) {
    const cwd = options.cwd || process.cwd();
    const rawTargets = (options.targetPaths && options.targetPaths.length > 0)
        ? options.targetPaths
        : ['README.md', 'docs'];
    const mdFiles = findMarkdownFiles(rawTargets, cwd);
    const results = [];
    let passedBlocks = 0;
    let failedBlocks = 0;
    let skippedBlocks = 0;
    for (const file of mdFiles) {
        const relFile = path.relative(cwd, file).replace(/\\/g, '/');
        const blocks = extractCodeBlocksFromMarkdown(file);
        for (const block of blocks) {
            block.file = relFile;
            const res = validateCodeBlock(block, cwd);
            results.push(res);
            if (res.status === 'pass')
                passedBlocks++;
            else if (res.status === 'fail')
                failedBlocks++;
            else if (res.status === 'skipped')
                skippedBlocks++;
        }
    }
    const passed = failedBlocks === 0;
    if (options.generateBadge) {
        const badgeFile = options.badgePath || path.join(cwd, 'docs-verified.svg');
        generateSvgBadge(passed, badgeFile);
    }
    return {
        timestamp: new Date().toISOString(),
        filesScanned: mdFiles.length,
        totalBlocks: results.length,
        passedBlocks,
        failedBlocks,
        skippedBlocks,
        results,
        status: passed ? 'passed' : 'failed',
    };
}
//# sourceMappingURL=runner.js.map