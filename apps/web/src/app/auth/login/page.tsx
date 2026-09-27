"use client";

import { useEffect, useRef } from "react";

import {
  COGNITO_AUTH_CONFIG,
  validateCognitoAuthConfig,
} from "@/config/auth";
import { beginLogin } from "@/lib/auth/login";

export async function startBrowserLogin(): Promise<void> {
  validateCognitoAuthConfig({
    domain: COGNITO_AUTH_CONFIG.domain,
    clientId: COGNITO_AUTH_CONFIG.clientId,
    redirectUri: COGNITO_AUTH_CONFIG.redirectUri,
    logoutUri: COGNITO_AUTH_CONFIG.logoutUri,
  });

  const authorizationUrl = await beginLogin({
    domain: COGNITO_AUTH_CONFIG.domain,
    clientId: COGNITO_AUTH_CONFIG.clientId,
    redirectUri: COGNITO_AUTH_CONFIG.redirectUri,
    scopes: COGNITO_AUTH_CONFIG.scopes,
  });

  window.location.assign(authorizationUrl.toString());
}

export default function LoginPage() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;

    void startBrowserLogin();
  }, []);

  return null;
}
