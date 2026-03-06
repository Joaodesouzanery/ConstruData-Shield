/**
 * Generate TOTP MCP Tool
 *
 * Generates RFC 6238 TOTP codes for 2FA-protected application testing.
 * Implements HOTP/TOTP from scratch using Node.js crypto.
 */

import { z } from 'zod';
import { createHmac } from 'node:crypto';

const inputSchema = z.object({
  secret: z.string().describe('Base32-encoded TOTP secret key'),
  digits: z.number().default(6).describe('Number of digits in the TOTP code'),
  period: z.number().default(30).describe('Time step in seconds'),
});

/** Decode a base32-encoded string to a Buffer */
function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleaned = encoded.replace(/[=\s]/g, '').toUpperCase();

  let bits = '';
  for (const char of cleaned) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) throw new Error(`Invalid base32 character: ${char}`);
    bits += idx.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return Buffer.from(bytes);
}

/** Generate a TOTP code */
function generateTotp(secret: string, digits: number, period: number): string {
  const key = base32Decode(secret);
  const counter = Math.floor(Date.now() / 1000 / period);

  // Convert counter to 8-byte big-endian buffer
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  // HMAC-SHA1
  const hmac = createHmac('sha1', key);
  hmac.update(counterBuffer);
  const hash = hmac.digest();

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (code % Math.pow(10, digits)).toString().padStart(digits, '0');
}

export const generateTotpTool = {
  name: 'generate_totp',
  description: 'Generate a TOTP (Time-based One-Time Password) code for 2FA authentication',
  inputSchema,
  handler: async (input: z.infer<typeof inputSchema>) => {
    try {
      const code = generateTotp(input.secret, input.digits, input.period);
      const timeRemaining = input.period - (Math.floor(Date.now() / 1000) % input.period);

      return {
        content: [{
          type: 'text' as const,
          text: `TOTP Code: ${code} (valid for ${timeRemaining}s)`,
        }],
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text' as const, text: `Error generating TOTP: ${msg}` }],
      };
    }
  },
};
