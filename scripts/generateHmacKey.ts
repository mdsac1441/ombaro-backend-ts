#!/usr/bin/env bun
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';

const env = Bun.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const configDir = join(import.meta.dir, '../src/configs', env);
const KEY_FILE = join(configDir, 'HmacPepperKey.pem');
const KEY_LENGTH = 64; /// 512-bit key for SHA-512
const KEYS_TO_KEEP = 3; /// Number of previous versions to retain

interface KeyRotationResult {
  currentKey: string;
  previousKeys: string[];
  rotatedAt: Date;
}

const ensureKeyDirectory = (): void => {
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
    console.log(`Created key directory: ${configDir}`);
  }
};

const generateHmacKey = (): string => randomBytes(KEY_LENGTH).toString('hex');

const formatAsPem = (key: string): string =>
  `-----BEGIN HMAC PEPPER KEY-----\n${
    key.match(/.{1,64}/g)?.join('\n') || key
  }\n-----END HMAC PEPPER KEY-----\n`;

const parsePemFile = (content: string): string => {
  const matches = content.match(/-----BEGIN HMAC PEPPER KEY-----([\s\S]+?)-----END HMAC PEPPER KEY-----/);
  if (!matches) throw new Error('Invalid PEM format');
  return matches[1].replace(/\s+/g, '');
}

const loadCurrentKeys = (): { current?: string; previous?: string[] } => {
  if (!existsSync(KEY_FILE)) return {};

  try {
    const content = readFileSync(KEY_FILE, 'utf-8');
    const currentKey = parsePemFile(content);

    const previousKeys: string[] = [];
    for (let i = 1; i <= KEYS_TO_KEEP; i++) {
      const backupFile = `${KEY_FILE}.${i}`;
      if (existsSync(backupFile)) {
        previousKeys.push(parsePemFile(readFileSync(backupFile, 'utf-8')));
      }
    }

    return { current: currentKey, previous: previousKeys };
  } catch (error) {
    console.error('⚠️ Error reading existing key file:', error instanceof Error ? error.message : String(error));
    return {};
  }
};

const rotateKeys = (): KeyRotationResult => {
  ensureKeyDirectory();
  const { current, previous = [] } = loadCurrentKeys();
  const newKey = generateHmacKey();

  for (let i = KEYS_TO_KEEP; i > 0; i--) {
    const source = i === 1 ? KEY_FILE : `${KEY_FILE}.${i - 1}`;
    if (existsSync(source)) {
      writeFileSync(`${KEY_FILE}.${i}`, readFileSync(source, 'utf-8'));
    }
  }

  writeFileSync(KEY_FILE, formatAsPem(newKey), { mode: 0o600 });

  const result: KeyRotationResult = {
    currentKey: newKey,
    previousKeys: [current, ...previous].filter(Boolean) as string[],
    rotatedAt: new Date(),
  };

  writeFileSync(
    join(configDir, 'HmacPepperKey.meta.json'),
    JSON.stringify(
      {
        rotatedAt: result.rotatedAt.toISOString(),
        keyVersion: `v${Date.now()}`,
        previousVersions: result.previousKeys.length,
      },
      null,
      2
    )
  );

  return result;
};

/// Main execution
try {
  const result = rotateKeys();

  console.log('✅ HMAC Pepper Key Rotation Complete');
  console.log(`🔑 New Key: ${result.currentKey.substring(0, 8)}... (stored in ${KEY_FILE})`);
  console.log(`🗝️ ${result.previousKeys.length} previous versions retained`);
  console.log(`⏱️ Rotated At: ${result.rotatedAt.toISOString()}`);

  console.log('\n🔒 Security Notice:');
  console.log(`- Key file permissions set to 600 (owner read/write only)`);
  console.log(`- Store this file securely and NEVER commit it to version control`);
  console.log(`- Consider encrypting the key file for production use`);

  process.exit(0);
} catch (error) {
  console.error('❌ HMAC Key Rotation Failed:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
