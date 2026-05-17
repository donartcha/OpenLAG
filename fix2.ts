import fs from 'fs';
['docs/versions/components-versions.md', 'docs/versions/versions.md'].forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    while (content.includes('---\n---')) {
        content = content.replace(/---\n---/g, '---\n\n---');
    }
    fs.writeFileSync(file, content);
});
