// src/utils/hash.ts

/**
 * Returns the low 128 bits (last 16 bytes) of a SHA-256 hash as a hex string.
 */
/* export async function getLow128BitsOfSHA256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const low128 = new Uint8Array(hashBuffer).slice(16); // last 16 bytes
  const hex = Array.from(low128)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex; // 32-character lowercase hex string
}
 */

export async function getLow128BitsOfSHA256(input: string): Promise<bigint> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const low128 = new Uint8Array(hashBuffer).slice(16); // last 16 bytes = low 128 bits

  // Convert bytes to BigInt (u128)
  let result = BigInt(0);
  for (let i = 0; i < 16; i++) {
    result = (result << BigInt(8)) + BigInt(low128[i]);
  }
  return result;
}
