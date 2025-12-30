const fs = require('fs');
const path = require('path');
const https = require('https');

// 导入数据
const promptsFilePath = path.join(__dirname, 'data', 'prompts.ts');
const publicImagesDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
}

const content = fs.readFileSync(promptsFilePath, 'utf8');

// 提取所有 GitHub 原始图片链接
const urlRegex = /https:\/\/raw\.githubusercontent\.com\/([^\s"']+)/g;
const matches = Array.from(content.matchAll(urlRegex));
const urls = Array.from(new Set(matches.map(m => m[0])));

console.log(`发现 ${urls.length} 个唯一图片链接，准备下载...`);

// GitHub Raw IP 绕过 DNS
const GITHUB_RAW_IP = '185.199.108.133';

async function downloadImage(url) {
    const filename = path.basename(url);
    const targetPath = path.join(publicImagesDir, filename);

    if (fs.existsSync(targetPath)) {
        return;
    }

    const urlObj = new URL(url);
    const options = {
        hostname: GITHUB_RAW_IP, // 使用 IP
        port: 443,
        path: urlObj.pathname,
        method: 'GET',
        headers: {
            'Host': 'raw.githubusercontent.com', // 必须传 Host 头部
            'User-Agent': 'Mozilla/5.0'
        },
        rejectUnauthorized: false // 忽略 IP 证书不匹配
    };

    return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // 处理重定向 (GitHub 有时会重定向到其他 raw 节点)
                downloadImage(response.headers.location).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`下载失败 ${url}: 状态码 ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(targetPath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`已下载: ${filename}`);
                resolve();
            });
        });

        request.on('error', (err) => {
            reject(err);
        });
        
        request.setTimeout(10000, () => {
            request.destroy();
            reject(new Error(`超时: ${url}`));
        });

        request.end();
    });
}

async function run() {
    const batchSize = 5; // 减小并发以提高稳定性
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        await Promise.all(batch.map(url => 
            downloadImage(url).catch(err => console.error(`[错误] ${path.basename(url)}: ${err.message}`))
        ));
        console.log(`进度: ${Math.min(i + batchSize, urls.length)} / ${urls.length}`);
    }
    console.log('下载任务执行完毕，请检查 public/images 目录。');
}

run();
