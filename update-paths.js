const fs = require('fs');
const path = require('path');

const promptsFilePath = path.join(__dirname, 'data', 'prompts.ts');
let content = fs.readFileSync(promptsFilePath, 'utf8');

// 匹配并替换 GitHub 原始链接为本地路径
// 原链接: https://raw.githubusercontent.com/songguoxs/gpt4o-image-prompts/master/images/630.jpeg
// 替换为: /images/630.jpeg
const urlRegex = /https:\/\/raw\.githubusercontent\.com\/[^\s"']+\/images\/([^\s"']+)/g;

const newContent = content.replace(urlRegex, (match, filename) => {
    return `/images/${filename}`;
});

fs.writeFileSync(promptsFilePath, newContent, 'utf8');
console.log('数据路径更新完成！现在图片将从本地 /images/ 目录加载。');
