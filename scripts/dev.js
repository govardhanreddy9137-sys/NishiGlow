import { spawn } from 'node:child_process';

const children = [
  spawn(process.execPath, ['server.js'], { stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit' })
];

let shuttingDown = false;

const shutdown = (exitCode) => {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = exitCode;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
};

for (const child of children) {
  child.on('error', (error) => {
    console.error('[Dev] Failed to start a development process:', error.message);
    shutdown(1);
  });
  child.on('exit', (code) => {
    if (!shuttingDown) shutdown(code ?? 1);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
