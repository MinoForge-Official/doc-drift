================================================================================
DOC-DRIFT (v1.0.0)
Author: MinoForge-Official (@MinoForge-Official)
================================================================================

Guarantee that your documentation code snippets actually compile and work.

[QUICK LINKS]
- Web: https://github.com/
- License: MIT Open Source
- Supported: TypeScript, JavaScript, JSON, Python, Bash

================================================================================
1. OVERVIEW & PURPOSE
================================================================================
Over 90% of open-source projects have broken README code snippets because
APIs change but documentation isn't automatically tested.

doc-drift extracts all fenced codeblocks from your markdown files, validates
their syntax, verifies that imported packages are declared in package.json,
and generates an official verified documentation badge.

================================================================================
2. QUICKSTART COMMANDS
================================================================================
# Test README.md and docs folder
$ npx doc-drift

# Test and generate local SVG badge
$ npx doc-drift --badge

# Strict CI check (exits with code 1 on failure)
$ npx doc-drift --strict

================================================================================
3. SKIPPING SNIPPETS
================================================================================
Add 'skip' to the codeblock tag:
```ts skip
myPseudoCode();
```

Or add HTML comment:
<!-- doc-drift:skip -->

================================================================================
4. GITHUB BADGE MARKDOWN
================================================================================
[![docs: verified](https://img.shields.io/badge/docs-verified_working-brightgreen?style=flat-square)](https://github.com/)

License: MIT (c) 2026. Keep your documentation truth-aligned.
