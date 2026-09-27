import { COGNITO_AUTH_CONFIG } from "@/config/auth";

import {
  validateAuthorizationCallback,
  type AuthorizationCallbackParams,
} from "./callback";
import { createBrowserAuthSession } from "./session";
import { exchangeAuthorizationCode } from "./token";
import {
  clearPkceTransaction,
  loadOAuthState,
  loadPkceVerifier,
} from "./transaction";

export interface CompleteBrowserLoginResult {
  session: ReturnType<typeof createBrowserAuthSession>;
}

export async function completeBrowserLogin(
  params: AuthorizationCallbackParams,
): Promise<CompleteBrowserLoginResult> {
  const expectedState = loadOAuthState();

  if (!expectedState) {
    throw new Error("OAuth transaction is missing.");
  }

  const { code } = validateAuthorizationCallback(params, expectedState);

  const codeVerifier = loadPkceVerifier();

  if (!codeVerifier) {
    throw new Error("PKCE transaction is missing.");
  }

  try {
    const tokenResponse = await exchangeAuthorizationCode({
      domain: COGNITO_AUTH_CONFIG.domain,
      clientId: COGNITO_AUTH_CONFIG.clientId,
      redirectUri: COGNITO_AUTH_CONFIG.redirectUri,
      code,
      codeVerifier,
    });

    return {
      session: createBrowserAuthSession(
        tokenResponse.accessToken,
        tokenResponse.expiresIn,
      ),
    };
  } finally {
    clearPkceTransaction();
  }
}
