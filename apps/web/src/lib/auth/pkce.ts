const PKCE_VERIFIER_LENGTH = 64;

const PKCE_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function generateCodeVerifier(): string {
  const randomBytes = new Uint8Array(PKCE_VERIFIER_LENGTH);
  crypto.getRandomValues(randomBytes);

  let verifier = "";

  for (const byte of randomBytes) {
    verifier += PKCE_ALPHABET[byte % PKCE_ALPHABET.length];
  }

  return verifier;
}

export async function generateCodeChallenge(
  verifier: string,
): Promise<string> {
  const encodedVerifier = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encodedVerifier,
  );

  return bytesToBase64Url(new Uint8Array(digest));
}
