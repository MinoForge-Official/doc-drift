import fs from 'node:fs';
import path from 'node:path';
export function getBadgeMarkdown(passed) {
    if (passed) {
        return `[![docs: verified](https://img.shields.io/badge/docs-verified_working-brightgreen?style=flat-square)](https://github.com/)`;
    }
    return `[![docs: failing](https://img.shields.io/badge/docs-syntax_errors-red?style=flat-square)](https://github.com/)`;
}
export function generateSvgBadge(passed, outputPath) {
    const color = passed ? '#4c1' : '#e05d44';
    const text = passed ? 'verified' : 'failing';
    const width = passed ? 90 : 84;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="docs: ${text}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${width}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="37" height="20" fill="#555"/>
    <rect x="37" width="${width - 37}" height="20" fill="${color}"/>
    <rect width="${width}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="195" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="270">docs</text>
    <text x="195" y="140" transform="scale(.1)" fill="#fff" textLength="270">docs</text>
    <text aria-hidden="true" x="${(37 + (width - 37) / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${text}</text>
    <text x="${(37 + (width - 37) / 2) * 10}" y="140" transform="scale(.1)" fill="#fff">${text}</text>
  </g>
</svg>`;
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, svg, 'utf-8');
}
//# sourceMappingURL=badge.js.map