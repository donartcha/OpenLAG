
import fs from "fs";
import path from "path";
import { RawDocument } from "./types.js";

export function scanDocs(docsDir: string): RawDocument[] {
    const documents: RawDocument[] = [];

    const traverse = (dir: string) => {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.md')) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                documents.push({
                    file: fullPath,
                    content
                });
            }
        }
    };

    traverse(docsDir);
    return documents;
}
