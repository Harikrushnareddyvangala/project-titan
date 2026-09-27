export interface AuthorizationUrlConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  scopes: readonly string[];
  codeChallenge: string;
  state: string;
}

export function buildAuthorizationUrl(
  config: AuthorizationUrlConfig,
): URL {
  const url = new URL("/oauth2/authorize", config.domain);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("scope", config.scopes.join(" "));
  url.searchParams.set("code_challenge", config.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", config.state);

  return url;
}
