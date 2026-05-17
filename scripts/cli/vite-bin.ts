import path from 'path';
import { createRequire } from 'module';

export function resolveViteBin(importMetaUrl: string) {
  const require = createRequire(importMetaUrl);
  const viteEntry = require.resolve('vite');
  return path.resolve(path.dirname(viteEntry), '../../bin/vite.js');
}
