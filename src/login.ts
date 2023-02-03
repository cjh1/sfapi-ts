import { Client } from "./sfapi";

export function setupLogin(element: HTMLButtonElement) {
  const OIDC_CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID;
  const REDIRECT_URL = "http://localhost:3000/sso";
  const OIDC_BASE_URL = import.meta.env.VITE_OIDC_BASE_URL;
  const AUTH_URL = OIDC_BASE_URL + "/saml/oidc/authorization";
  const TOKEN_URL = OIDC_BASE_URL + "/oidc/token";

  const client = new Client(
    OIDC_CLIENT_ID,
    new URL(REDIRECT_URL),
    new URL(AUTH_URL),
    new URL(TOKEN_URL)
  );

  element.addEventListener("click", () => {
    client.authorize();
  });
}
