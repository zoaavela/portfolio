import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');
const componentsDir = path.join(__dirname, 'src', 'components');

const replacements = [
    { from: /text-\[#111\]/g, to: 'text-[#444]' },
    { from: /text-\[#1a1a1a\]/ig, to: 'text-[#555]' },
    { from: /text-\[#222\]/g, to: 'text-[#666]' },
    { from: /text-\[#333\]/g, to: 'text-[#888]' },
    { from: /text-\[#444\]/g, to: 'text-[#999]' },
    { from: /text-\[#555\]/g, to: 'text-[#AAA]' },
    { from: /text-\[#666\]/g, to: 'text-[#BBB]' },
    { from: /text-\[#777\]/g, to: 'text-[#CCC]' },
    { from: /text-\[#888\]/g, to: 'text-[#DDD]' },
    { from: /border-\[#1a1a1a\]/ig, to: 'border-[#333]' },
    { from: /border-\[#222\]/g, to: 'border-[#444]' }
];

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            if (file === 'Home.jsx' || file === 'Projects.jsx') continue;
            
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content;
            for (const r of replacements) {
                newContent = newContent.replace(r.from, r.to);
            }
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${file}`);
            }
        }
    }
}

processDir(pagesDir);
processDir(componentsDir);
console.log('Contrast adjustment complete.');
