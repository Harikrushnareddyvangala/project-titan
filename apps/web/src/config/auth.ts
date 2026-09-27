export interface CognitoBrowserAuthConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  logoutUri: string;
}

export function validateCognitoAuthConfig(
  config: CognitoBrowserAuthConfig,
): void {
  const requiredFields = [
    ["NEXT_PUBLIC_COGNITO_DOMAIN", config.domain],
    ["NEXT_PUBLIC_COGNITO_CLIENT_ID", config.clientId],
    ["NEXT_PUBLIC_COGNITO_REDIRECT_URI", config.redirectUri],
    ["NEXT_PUBLIC_COGNITO_LOGOUT_URI", config.logoutUri],
  ] as const;

  for (const [name, value] of requiredFields) {
    if (!value.trim()) {
      throw new Error(`${name} is required.`);
    }
  }
}

export const COGNITO_AUTH_CONFIG = {
  domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN ?? "",
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
  redirectUri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI ?? "",
  logoutUri: process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI ?? "",
  scopes: ["openid", "email", "profile"],
} as const;
