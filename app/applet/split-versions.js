const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

['docs/versions/components-versions.md', 'docs/versions/versions.md'].forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf-8');
    
    // Split by ---, filter out empty, then write to separate files
    // But gray-matter or yaml might better handle it if we are careful
    const blocks = content.split(/^---/gm).filter(s => s.trim().length > 0);
    
    blocks.forEach((block, index) => {
        // block does not have --- at the start or end
        const stringVal = '---\n' + block.trim() + '\n---\n';
        
        try {
            const parsed = matter(stringVal);
            if (parsed.data && parsed.data.id) {
                const outPath = path.join(path.dirname(file), `${parsed.data.id}.md`);
                fs.writeFileSync(outPath, stringVal, 'utf-8');
                console.log(`Wrote ${outPath}`);
            }
        } catch (e) {
            console.error("Error parsing block", e);
        }
    });

    // Delete the original file
    fs.unlinkSync(file);
});
