import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// 动态导入 Lute 模块
await import('./lute.min.cjs');
import markdownit from 'markdown-it';
import sweet from "#sweet/SweetEngineBase.js";
// 当前文件的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//
// 文件路径
const testFiles = [
    'markdowns/doc1.md',
];

// 解析引擎名称
const parsers = [
    { name: 'Lute', parser: (text) => {
            let lute = Lute.New();
            return lute.MarkdownStr("", text);
        }},
    { name: 'markdown-it', parser: (text) => {
            const md = markdownit()
            return  md.render(text);
        }},
    { name: 'sweet-markdown', parser: (text) => {
           return sweet.toHtml(text);
        }}
];

// 读取文件
function readMarkdownFile(file) {
    return fs.readFileSync(path.join(__dirname, file), 'utf-8');
}

// 测量性能（时间和内存）
function measurePerformance(label, parseFunction, text) {
    const startMemory = process.memoryUsage().heapUsed;
    const startTime = process.hrtime.bigint();

   // 写出渲染结果
    fs.writeFileSync(label+'.html',  parseFunction(text));

    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage().heapUsed;
    const duration = Number(endTime - startTime) / 1e6; // 毫秒
    const memoryUsage = (endMemory - startMemory) / 1024 / 1024; // MB

    return { label, duration: duration.toFixed(2), memory: memoryUsage.toFixed(2) };
}

// 生成报告
function generateReport(results) {
    let markdownReport = `# Markdown Parser Performance Report\n\n`;
    markdownReport += `| Document | Parser | Time (ms) | Memory (MB) |\n`;
    markdownReport += `|----------|--------|-----------|-------------|\n`;

    results.forEach(result => {
        markdownReport += `| ${result.file} | ${result.parser} | ${result.duration} | ${result.memory} |\n`;
    });

    return markdownReport;
}

// 主函数：测试所有文档和解析器
async function runTests() {
    const results = [];

    for (const file of testFiles) {
        const markdownText = readMarkdownFile(file);
        console.log(`Testing file: ${file}`);

        for (const parser of parsers) {
            const { label, duration, memory } = measurePerformance(parser.name, parser.parser, markdownText);
            results.push({ file, parser: label, duration, memory });
            console.log(`  ${parser.name} took ${duration} ms, used ${memory} MB`);

        }
    }

    // 生成测试结果报告
    const report = generateReport(results);
    fs.writeFileSync('performance_report.md', report);
    console.log('Performance report generated: performance_report.md');
}

runTests()
