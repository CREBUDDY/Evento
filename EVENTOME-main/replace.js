const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = content
                .replace(/from "firebase\/firestore"/g, 'from "@/firebase"')
                .replace(/from 'firebase\/firestore'/g, "from '@/firebase'")
                .replace(/from "firebase\/auth"/g, 'from "@/firebase"')
                .replace(/from 'firebase\/auth'/g, "from '@/firebase'");
            if (content !== modified) {
                fs.writeFileSync(fullPath, modified, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}
replaceInDir(path.join(__dirname, 'src'));
