import {
  Configuration,
  OAuth2AuthCodePKCE,
  AccessContext,
} from "@bity/oauth2-auth-code-pkce";
import { OpenAPIConfig } from "./_internal";

import { ClientBase } from "./_internal/ClientBase";

export class Client extends ClientBase {
  private oauth: OAuth2AuthCodePKCE;
  id_token: string | undefined;

  /**
   *
   * @param clientID - The OIDC client id
   * @param redirectUrl - The URI to redirect to after the interaction is complete
   * @param authorizationUrl - The OIDC authorization URL
   * @param tokenUrl - The OIDC token URL
   * @param apiBaseUrl - The base URL for the SF API instance
   */
  constructor(
    clientID: string,
    redirectUrl: URL,
    authorizationUrl: URL,
    tokenUrl: URL,
    apiBaseUrl: URL
  ) {
    const openApiConfig: Partial<OpenAPIConfig> = {
      BASE: apiBaseUrl.toString(),
    };

    super(openApiConfig);

    const config: Configuration = {
      clientId: clientID,
      redirectUrl: redirectUrl.toString(),
      authorizationUrl: authorizationUrl.toString(),
      tokenUrl: tokenUrl.toString(),
      scopes: ["profile", "email", "openid", "nersc", "https://api.nersc.gov"],
      explicitlyExposedTokens: ["id_token"],
      extraAuthorizationParams: {
        claims: JSON.stringify({
          id_token: {
            email: { essential: true },
            preferred_username: { essential: true },
            ip_range: { essential: true },
          },
        }),
      },
      onAccessTokenExpiry: this._onAccessTokenExpiry,
      onInvalidGrant: this._onInvalidGrant,
    };

    this.oauth = new OAuth2AuthCodePKCE(config);

    this.oauth
      .isReturningFromAuthServer()
      .then(async (hasAuthCode: boolean) => {
        if (!hasAuthCode) {
          throw new Error("Something wrong...no auth code.");
        }
        const token = await this.oauth.getAccessToken();
        this.id_token = token.explicitlyExposedTokens?.id_token;
        this.request.config.TOKEN = this.id_token;
      });
  }

  private _onAccessTokenExpiry(
    refreshAccessToken: () => Promise<AccessContext>
  ): Promise<AccessContext> {
    console.log("Expired! Access token needs to be renewed.");
    alert(
      "We will try to get a new access token via grant code or refresh token."
    );
    return refreshAccessToken();
  }

  private _onInvalidGrant(
    _refreshAuthCodeOrRefreshToken: () => Promise<void>
  ): void {
    console.log("Expired! Auth code or refresh token needs to be renewed.");
    alert("Redirecting to auth server to obtain a new auth grant code.");
    //return refreshAuthCodeOrRefreshToken();
  }

  authorize(): void {
    this.oauth.fetchAuthorizationCode();
  }

  /** {@inheritDoc ClientBase.account} */
}

export { ClientBase } from "./_internal";
