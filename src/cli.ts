#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { runDocDrift } from './runner.js';
import { printReport, printBanner } from './reporter.js';
import { DocDriftOptions } from './types.js';
import { c } from './colors.js';

const HELP_TEXT = `
doc-drift - Markdown Executable Test Runner & Docs Validator

USAGE:
  doc-drift [paths...] [options]

ARGUMENTS:
  [paths...]            Target markdown files or directories (default: README.md, docs)

OPTIONS:
  --badge               Generate a docs-verified.svg status badge
  --badge-path <path>   Custom output path for the SVG badge
  --strict              Strict mode: exit with code 1 if any snippet fails
  --json                Output scan results in JSON format
  -h, --help            Show this help message
  -v, --version         Show doc-drift version

SUPPORTED CODEBLOCK LANGUAGES:
  • javascript, typescript (validates syntax + checks imports against package.json)
  • json (validates strict JSON syntax)
  • bash, shell (validates quote balancing and command structure)
  • python (validates parenthesis/bracket balancing and syntax)

SKIP TESTING A SNIPPET:
  Add 'skip' to language tag: \`\`\`ts skip
  Or add comment directly above: <!-- doc-drift:skip -->

EXAMPLES:
  $ npx doc-drift                      # Test README.md and docs folder
  $ npx doc-drift README.md --badge    # Test README and generate badge
  $ npx doc-drift --strict             # Run in CI/CD pipeline
`;

async function run(): Promise<void> {
  try {
    const { values, positionals } = parseArgs({
      options: {
        badge: { type: 'boolean', default: false },
        'badge-path': { type: 'string' },
        strict: { type: 'boolean', default: false },
        json: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
        version: { type: 'boolean', short: 'v', default: false },
      },
      allowPositionals: true,
    });

    if (values.help) {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (values.version) {
      console.log('doc-drift v1.0.0');
      process.exit(0);
    }

    const options: DocDriftOptions = {
      targetPaths: positionals.length > 0 ? positionals : undefined,
      strict: values.strict,
      json: values.json,
      generateBadge: values.badge,
      badgePath: values['badge-path'],
    };

    const report = runDocDrift(options);
    printReport(report, options);

    if (report.status === 'failed') {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.stack || err.message : String(err);
    console.error(c.red(`\ndoc-drift fatal error: ${msg}\n`));
    process.exit(1);
  }
}

run();
