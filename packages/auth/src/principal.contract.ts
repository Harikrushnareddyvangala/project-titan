import type { AuthenticatedPrincipal } from "./principal.js";

const cognitoPrincipal: AuthenticatedPrincipal = {
  provider: "cognito",
  subject: "example-subject",
};

const externalPrincipal: AuthenticatedPrincipal = {
  provider: "external-oidc",
  subject: "example-subject",
};

void cognitoPrincipal;
void externalPrincipal;
