const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../zerothan_cli');
const targetDir = path.resolve(__dirname, '../python-compiler-service/zerothan_cli');

console.log(`Syncing CLI from ${sourceDir} to ${targetDir}...`);

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        // Skip node_modules and .git
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '__pycache__') {
            continue;
        }

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
}

try {
    copyDir(sourceDir, targetDir);
    console.log('Sync complete!');
} catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
}
