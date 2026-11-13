import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const scryptAsync = promisify(scrypt);
const envPath = new URL('../.env', import.meta.url);
const minimumPasswordLength = 12;

const readHidden = (prompt) => new Promise((resolve, reject) => {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    reject(new Error('Run this command in an interactive terminal so the password can be entered privately.'));
    return;
  }

  let value = '';
  process.stdout.write(prompt);
  input.setEncoding('utf8');
  input.setRawMode(true);
  input.resume();

  const finish = (error) => {
    input.removeListener('data', onData);
    input.setRawMode(false);
    input.pause();
    process.stdout.write('\n');
    if (error) reject(error);
    else resolve(value);
  };

  const onData = (chunk) => {
    for (const character of chunk) {
      if (character === '\u0003') {
        finish(new Error('Password setup cancelled.'));
        return;
      }
      if (character === '\r' || character === '\n') {
        finish();
        return;
      }
      if (character === '\u0008' || character === '\u007f') {
        value = Array.from(value).slice(0, -1).join('');
      } else if (character >= ' ') {
        value += character;
      }
    }
  };

  input.on('data', onData);
});

const saveHash = async () => {
  if (!existsSync(envPath)) {
    throw new Error('The project .env file is missing. Create it from .env.example first.');
  }

  const password = await readHidden('New admin website password (12+ characters): ');
  const confirmation = await readHidden('Re-enter the new admin password: ');
  if (password.length < minimumPasswordLength) {
    throw new Error(`Use at least ${minimumPasswordLength} characters for the admin password.`);
  }
  if (password !== confirmation) {
    throw new Error('The passwords do not match. No changes were made.');
  }

  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 64);
  const passwordHash = `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
  const env = readFileSync(envPath, 'utf8');
  const settingLines = env.match(/^ADMIN_PASSWORD_HASH=.*$/gm) || [];
  if (settingLines.length > 1) {
    throw new Error('Found duplicate ADMIN_PASSWORD_HASH settings. Remove duplicates and try again.');
  }
  const updatedEnv = settingLines.length
    ? env.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${passwordHash}`)
    : `${env.replace(/\s*$/, '')}\nADMIN_PASSWORD_HASH=${passwordHash}\n`;
  writeFileSync(envPath, updatedEnv, 'utf8');
  console.log('Admin password hash saved to .env. The password itself was not stored or displayed.');
};

saveHash().catch((error) => {
  console.error(`[Admin password setup] ${error.message}`);
  process.exitCode = 1;
});
