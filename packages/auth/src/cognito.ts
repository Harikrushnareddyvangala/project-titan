import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { AuthenticatedPrincipal } from "./principal.js";

export interface CognitoAuthConfig {
  /** Amazon Cognito User Pool ID. */
  userPoolId: string;

  /** Cognito app client ID expected in the token. */
  clientId: string;
}

export function createCognitoPrincipalVerifier(
  config: CognitoAuthConfig,
) {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: config.userPoolId,
    clientId: config.clientId,
    tokenUse: "access",
  });

  return async (accessToken: string): Promise<AuthenticatedPrincipal> => {
    const payload = await verifier.verify(accessToken);

    return {
      provider: "cognito",
      subject: payload.sub,
    };
  };
}
