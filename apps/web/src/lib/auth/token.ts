export interface AuthorizationCodeExchangeConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  code: string;
  codeVerifier: string;
}

export interface CognitoTokenResponse {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  tokenType: string;
  expiresIn: number;
}

interface CognitoTokenPayload {
  access_token?: unknown;
  refresh_token?: unknown;
  id_token?: unknown;
  token_type?: unknown;
  expires_in?: unknown;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseTokenResponse(payload: unknown): CognitoTokenResponse {
  if (!payload || typeof payload !== "object") {
    throw new Error("Token response is invalid.");
  }

  const tokenPayload = payload as CognitoTokenPayload;

  if (
    !isNonEmptyString(tokenPayload.access_token) ||
    !isNonEmptyString(tokenPayload.token_type) ||
    typeof tokenPayload.expires_in !== "number" ||
    !Number.isFinite(tokenPayload.expires_in) ||
    tokenPayload.expires_in <= 0
  ) {
    throw new Error("Token response is invalid.");
  }

  if (
    tokenPayload.refresh_token !== undefined &&
    !isNonEmptyString(tokenPayload.refresh_token)
  ) {
    throw new Error("Token response is invalid.");
  }

  if (
    tokenPayload.id_token !== undefined &&
    !isNonEmptyString(tokenPayload.id_token)
  ) {
    throw new Error("Token response is invalid.");
  }

  return {
    accessToken: tokenPayload.access_token,
    refreshToken: tokenPayload.refresh_token,
    idToken: tokenPayload.id_token,
    tokenType: tokenPayload.token_type,
    expiresIn: tokenPayload.expires_in,
  };
}

export async function exchangeAuthorizationCode(
  config: AuthorizationCodeExchangeConfig,
): Promise<CognitoTokenResponse> {
  const tokenUrl = new URL("/oauth2/token", config.domain);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    code: config.code,
    redirect_uri: config.redirectUri,
    code_verifier: config.codeVerifier,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Token exchange failed.");
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error("Token response is invalid.");
  }

  return parseTokenResponse(payload);
}
