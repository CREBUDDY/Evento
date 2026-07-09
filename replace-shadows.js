const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplaceInDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndReplaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('rgba(0,0,0,1)')) {
        content = content.replace(/rgba\(0,0,0,1\)/g, 'var(--brutal-shadow)');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

// Update tailwind.config.ts too
const tailwindPath = path.join(__dirname, 'tailwind.config.ts');
if (fs.existsSync(tailwindPath)) {
    let content = fs.readFileSync(tailwindPath, 'utf8');
    if (content.includes('rgba(0,0,0,1)')) {
        content = content.replace(/rgba\(0,0,0,1\)/g, 'var(--brutal-shadow)');
        fs.writeFileSync(tailwindPath, content, 'utf8');
        console.log(`Updated ${tailwindPath}`);
    }
}

findAndReplaceInDir(directoryPath);
console.log('Done replacing shadows.');
