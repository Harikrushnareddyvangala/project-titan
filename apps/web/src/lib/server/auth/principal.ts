import "server-only";

import {
  createCognitoPrincipalVerifier,
  type AuthenticatedPrincipal,
} from "@titan/auth";

export class UnauthenticatedRequestError extends Error {
  readonly status = 401;

  constructor(message = "Authentication required.") {
    super(message);
    this.name = "UnauthenticatedRequestError";
  }
}

function getCognitoPrincipalVerifier() {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_APP_CLIENT_ID;

  if (!userPoolId || !clientId) {
    throw new Error(
      "COGNITO_USER_POOL_ID and COGNITO_APP_CLIENT_ID are required.",
    );
  }

  return createCognitoPrincipalVerifier({
    userPoolId,
    clientId,
  });
}

export async function authenticateRequest(
  request: Request,
): Promise<AuthenticatedPrincipal> {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new UnauthenticatedRequestError();
  }

  const accessToken = authorization.slice("Bearer ".length).trim();

  if (!accessToken) {
    throw new UnauthenticatedRequestError();
  }

  try {
    return await getCognitoPrincipalVerifier()(accessToken);
  } catch {
    throw new UnauthenticatedRequestError("Invalid authentication credentials.");
  }
}
