import { Client } from "./client";
import { AccessContext, OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";

jest.mock("@bity/oauth2-auth-code-pkce");

const CLIENT_ID = "test"; //
const REDIRECT_URL = "http://localhost/sso";
const OIDC_BASE_URL = "https://localhost";
const AUTH_URL = OIDC_BASE_URL + "/auth";
const TOKEN_URL = OIDC_BASE_URL + "/token";
const API_URL = "https://localhost/api/v1";

it("create a Client", () => {
  OAuth2AuthCodePKCE.prototype.isReturningFromAuthServer = () =>
    new Promise<boolean>(() => true);
  new Client(
    CLIENT_ID,
    new URL(REDIRECT_URL),
    new URL(AUTH_URL),
    new URL(TOKEN_URL),
    [],
    new URL(API_URL),
    () => {
      return new Promise<AccessContext>(() => {});
    },
    () => {}
  );
});
