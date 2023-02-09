import { Client } from "./sfapi";

let client: Client | null = null;

export function setupLogin(element: HTMLButtonElement) {
  const OIDC_CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID;
  const REDIRECT_URL = "http://localhost:3000/sso";
  const OIDC_BASE_URL = import.meta.env.VITE_OIDC_BASE_URL;
  const AUTH_URL = `${OIDC_BASE_URL}/saml/oidc/authorization`;
  const TOKEN_URL = `${OIDC_BASE_URL}/oidc/token`;
  const API_URL = import.meta.env.VITE_API_URL;

  client = new Client(
    OIDC_CLIENT_ID,
    new URL(REDIRECT_URL),
    new URL(AUTH_URL),
    new URL(TOKEN_URL),
    new URL(API_URL)
  );

  element.addEventListener("click", () => {
    if (client) {
      client.authorize();
    }
  });
}

export function setupStatus(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    if (client) {
      const status = await client.status.getStatus();
      console.log(status);

      const coriStatus = await client.status.getStatusBySystem("cori");
      console.log(coriStatus);

      const roles = await client.account.getRoles();
      console.log(roles);
    }
  });
}
