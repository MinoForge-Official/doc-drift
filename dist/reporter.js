import { c } from './colors.js';
import { getBadgeMarkdown } from './badge.js';
export function printBanner() {
    console.log(c.blue(`
  ██████╗  ██████╗  ██████╗     ██████╗ ██████╗ ██╗███████╗████████╗
  ██╔══██╗██╔═══██╗██╔════╝     ██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝
  ██║  ██║██║   ██║██║          ██║  ██║██████╔╝██║█████╗     ██║   
  ██║  ██║██║   ██║██║          ██║  ██║██╔══██╗██║██╔══╝     ██║   
  ██████╔╝╚██████╔╝╚██████╗     ██████╔╝██║  ██║██║██║        ██║   
  ╚═════╝  ╚═════╝  ╚═════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   
`));
    console.log(c.bold(`  📖 Markdown Executable Test Runner & Docs Validator  ${c.dim('v1.0.0')}\n`));
}
export function printReport(report, options = {}) {
    if (options.json) {
        console.log(JSON.stringify(report, null, 2));
        return;
    }
    printBanner();
    console.log(c.bold(`  Scanned: `) + `${report.filesScanned} markdown files (${report.totalBlocks} codeblocks found)\n`);
    for (const res of report.results) {
        const loc = `${res.block.file}:${res.block.startLine}-${res.block.endLine}`;
        const lang = c.dim(`[${res.block.rawLanguage || 'unknown'}]`);
        if (res.status === 'pass') {
            console.log(`  ${c.green('✔')} ${c.bold(loc)} ${lang} ${c.dim(`(${res.durationMs}ms)`)}`);
        }
        else if (res.status === 'fail') {
            console.log(`  ${c.red('✖')} ${c.bold(loc)} ${lang}`);
            console.log(`     ${c.bgRed(c.bold(' ERROR '))} ${c.red(res.error || 'Test failed')}`);
            if (res.details) {
                console.log(`     ${c.dim(res.details)}`);
            }
            console.log('');
        }
        else if (res.status === 'skipped') {
            console.log(`  ${c.gray('○')} ${c.dim(loc)} ${lang} ${c.dim('(skipped)')}`);
        }
    }
    console.log('\n' + c.dim('  ' + '─'.repeat(65)));
    console.log(`  Results: ` +
        `${c.green(`${report.passedBlocks} passed`)}, ` +
        `${report.failedBlocks > 0 ? c.red(`${report.failedBlocks} failed`) : c.dim('0 failed')}, ` +
        `${report.skippedBlocks > 0 ? c.gray(`${report.skippedBlocks} skipped`) : c.dim('0 skipped')}`);
    const passed = report.status === 'passed';
    if (passed) {
        console.log(`\n  ${c.bgGreen(c.bold(' DOCS VERIFIED '))} ${c.green('All code examples are up-to-date and working.')}`);
        console.log(`\n  ${c.cyan('🏅 Add this verified badge to your README:')}`);
        console.log(`  ${c.bold(getBadgeMarkdown(true))}\n`);
    }
    else {
        console.log(`\n  ${c.bgRed(c.bold(' DOCS OUT OF DATE '))} ${c.red('Some code snippets contain broken imports or syntax errors.')}\n`);
    }
}
//# sourceMappingURL=reporter.js.map