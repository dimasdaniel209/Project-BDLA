import { BirthdayConfig } from '../types';
import { DEFAULT_CONFIG } from './storage';

// Default application secret phrase for auto-encryption
const APP_DEFAULT_SECRET = 'birthday_surprise_magical_secret_key_2024';

/**
 * Derive an AES-GCM cryptographic key from a passphrase using PBKDF2
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a BirthdayConfig object into an encrypted string payload
 */
export async function encryptConfig(
  config: BirthdayConfig,
  customPassphrase?: string
): Promise<string> {
  const passphrase = customPassphrase?.trim() || APP_DEFAULT_SECRET;
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const enc = new TextEncoder();
  const plaintext = enc.encode(JSON.stringify(config));

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    plaintext
  );

  const payload = {
    v: 1,
    salt: Array.from(salt),
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(ciphertext)),
    timestamp: new Date().toISOString(),
  };

  return btoa(JSON.stringify(payload));
}

/**
 * Decrypt an encrypted string payload back into a BirthdayConfig object
 */
export async function decryptConfig(
  encryptedPayloadStr: string,
  customPassphrase?: string,
  silent = false
): Promise<BirthdayConfig> {
  try {
    const rawJson = atob(encryptedPayloadStr.trim());
    const payload = JSON.parse(rawJson);

    if (!payload.salt || !payload.iv || !payload.data) {
      throw new Error('Format file terenkripsi tidak valid');
    }

    const salt = new Uint8Array(payload.salt);
    const iv = new Uint8Array(payload.iv);
    const ciphertext = new Uint8Array(payload.data);

    // Try custom passphrase first if provided, then fallback to default app secret
    const passphrasesToTry = customPassphrase
      ? [customPassphrase, APP_DEFAULT_SECRET]
      : [APP_DEFAULT_SECRET];

    let decryptedText: string | null = null;

    for (const pass of passphrasesToTry) {
      try {
        const key = await deriveKey(pass, salt);
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          key,
          ciphertext
        );
        const dec = new TextDecoder();
        decryptedText = dec.decode(decryptedBuffer);
        break;
      } catch (err) {
        // Try next passphrase
      }
    }

    if (!decryptedText) {
      throw new Error('Gagal mendekripsi: Kunci enkripsi / password tidak cocok');
    }

    const parsed = JSON.parse(decryptedText);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (e: any) {
    if (!silent) {
      console.warn('Decryption issue:', e?.message || e);
    }
    throw new Error(e?.message || 'Gagal membaca file terenkripsi');
  }
}

/**
 * Download the current configuration as a .enc encrypted file
 */
export async function downloadEncryptedConfigFile(
  config: BirthdayConfig,
  filename = 'birthday-config.enc'
): Promise<void> {
  const encrypted = await encryptConfig(config);
  const blob = new Blob([encrypted], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Fetch and load auto-encrypted config from public/birthday-config.enc if present
 */
export async function loadEncryptedConfigFromPublic(): Promise<BirthdayConfig | null> {
  try {
    const response = await fetch('/birthday-config.enc');
    if (!response.ok) return null;
    const text = await response.text();
    if (!text || text.startsWith('<!DOCTYPE') || text.startsWith('<html') || text.trim().length < 20) {
      return null;
    }
    return await decryptConfig(text, undefined, true);
  } catch (e) {
    return null;
  }
}
