import { spawn } from 'child_process';
import http from 'http';
import path from 'path';

const specs = process.argv.slice(2);
const root = process.cwd();
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const playwrightCmd = process.platform === 'win32'
  ? path.join(root, 'node_modules', '.bin', 'playwright.cmd')
  : path.join(root, 'node_modules', '.bin', 'playwright');

function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }
        setTimeout(attempt, 250);
      });
      req.setTimeout(1000, () => req.destroy());
    };
    attempt();
  });
}

function killProcessTree(pid: number): void {
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    try {
      process.kill(-pid, 'SIGTERM');
    } catch {
      process.kill(pid, 'SIGTERM');
    }
  }
}

const server = spawn(npmCmd, ['run', 'preview:e2e'], {
  cwd: root,
  detached: process.platform !== 'win32',
  shell: process.platform === 'win32',
  stdio: ['ignore', 'pipe', 'pipe'],
});

server.stdout.on('data', (chunk) => process.stdout.write(chunk));
server.stderr.on('data', (chunk) => process.stderr.write(chunk));

try {
  await waitForServer('http://127.0.0.1:4173', 120_000);
  const test = spawn(playwrightCmd, ['test', ...specs], {
    cwd: root,
    env: { ...process.env, OPENLAG_EXTERNAL_SERVER: '1' },
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  const code = await new Promise<number>((resolve) => {
    test.on('exit', (exitCode) => resolve(exitCode ?? 1));
  });
  killProcessTree(server.pid!);
  process.exit(code);
} catch (error) {
  killProcessTree(server.pid!);
  console.error((error as Error).message);
  process.exit(1);
}
