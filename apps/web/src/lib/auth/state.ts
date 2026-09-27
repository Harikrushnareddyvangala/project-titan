const OAUTH_STATE_LENGTH = 32;

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

export function generateOAuthState(): string {
  const randomBytes = new Uint8Array(OAUTH_STATE_LENGTH);
  crypto.getRandomValues(randomBytes);

  return bytesToBase64Url(randomBytes);
}
