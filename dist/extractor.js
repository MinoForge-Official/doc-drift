import fs from 'node:fs';
function normalizeLanguage(lang) {
    const clean = lang.trim().toLowerCase().split(/\s+/)[0];
    if (['js', 'javascript', 'mjs', 'cjs'].includes(clean))
        return 'javascript';
    if (['ts', 'typescript', 'tsx', 'jsx'].includes(clean))
        return 'typescript';
    if (['json'].includes(clean))
        return 'json';
    if (['py', 'python'].includes(clean))
        return 'python';
    if (['bash', 'sh', 'shell', 'zsh'].includes(clean))
        return 'bash';
    return 'unknown';
}
export function extractCodeBlocksFromMarkdown(filePath) {
    if (!fs.existsSync(filePath))
        return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const blocks = [];
    let inBlock = false;
    let startLine = 0;
    let currentLang = '';
    let blockLines = [];
    let skipNext = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (trimmed === '<!-- doc-drift:skip -->' || trimmed === '<!-- doctest:skip -->') {
            skipNext = true;
            continue;
        }
        // Match code block opening: ```ts or ~~~python
        const openMatch = line.match(/^([`~]{3,})\s*([a-zA-Z0-9_\-\.]+)?(.*)$/);
        if (openMatch && !inBlock) {
            inBlock = true;
            startLine = i + 1;
            currentLang = openMatch[2] || '';
            blockLines = [];
            if (openMatch[3] && openMatch[3].includes('skip')) {
                skipNext = true;
            }
            continue;
        }
        if (inBlock) {
            // Check for code block closing
            if (/^([`~]{3,})\s*$/.test(trimmed)) {
                inBlock = false;
                const endLine = i + 1;
                const normalizedLang = normalizeLanguage(currentLang);
                blocks.push({
                    file: filePath,
                    startLine,
                    endLine,
                    language: normalizedLang,
                    rawLanguage: currentLang,
                    code: blockLines.join('\n'),
                    skipTest: skipNext || normalizedLang === 'unknown',
                });
                skipNext = false;
                continue;
            }
            blockLines.push(line);
        }
    }
    return blocks;
}
//# sourceMappingURL=extractor.js.map