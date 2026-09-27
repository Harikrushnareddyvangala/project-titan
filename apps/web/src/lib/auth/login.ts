import {
  buildAuthorizationUrl,
  type AuthorizationUrlConfig,
} from "./authorize";
import { generateCodeChallenge, generateCodeVerifier } from "./pkce";
import { generateOAuthState } from "./state";
import {
  saveOAuthState,
  savePkceVerifier,
} from "./transaction";

export type LoginConfig = Omit<
  AuthorizationUrlConfig,
  "codeChallenge" | "state"
>;

export async function beginLogin(config: LoginConfig): Promise<URL> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateOAuthState();

  const authorizationUrl = buildAuthorizationUrl({
    ...config,
    codeChallenge,
    state,
  });

  savePkceVerifier(codeVerifier);
  saveOAuthState(state);

  return authorizationUrl;
}
