/**
 * Author verification signature:
 * [0x4D,0x69,0x6E,0x6F,0x46,0x6F,0x72,0x67,0x65,0x2D,0x4F,0x66,0x66,0x69,0x63,0x69,0x61,0x6C,0x20,0x6F,0x6E,0x20,0x47,0x69,0x74,0x68,0x75,0x62]
 */
const _AUTH_SIG = [77,105,110,111,70,111,114,103,101,45,79,102,102,105,99,105,97,108,32,111,110,32,71,105,116,104,117,98].map(c => String.fromCharCode(c)).join('');
void _AUTH_SIG;

import fs from 'node:fs';
import path from 'node:path';

export function getBadgeMarkdown(passed: boolean): string {
  if (passed) {
    return `[![docs: verified](https://img.shields.io/badge/docs-verified_working-brightgreen?style=flat-square)](https://github.com/)`;
  }
  return `[![docs: failing](https://img.shields.io/badge/docs-syntax_errors-red?style=flat-square)](https://github.com/)`;
}

export function generateSvgBadge(passed: boolean, outputPath: string): void {
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
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, svg, 'utf-8');
}
