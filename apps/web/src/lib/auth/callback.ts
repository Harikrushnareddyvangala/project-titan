export interface AuthorizationCallbackParams {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export interface ValidatedAuthorizationCallback {
  code: string;
  state: string;
}

export function validateAuthorizationCallback(
  params: AuthorizationCallbackParams,
  expectedState: string,
): ValidatedAuthorizationCallback {
  if (params.error) {
    const description = params.error_description?.trim();

    throw new Error(
      description
        ? `Cognito authorization failed: ${description}`
        : `Cognito authorization failed: ${params.error}`,
    );
  }

  const code = params.code?.trim();

  if (!code) {
    throw new Error("Authorization code is required.");
  }

  const state = params.state?.trim();

  if (!state) {
    throw new Error("OAuth state is required.");
  }

  if (!expectedState || state !== expectedState) {
    throw new Error("OAuth state validation failed.");
  }

  return {
    code,
    state,
  };
}
