import {
  Configuration,
  OAuth2AuthCodePKCE,
  AccessContext,
} from "@bity/oauth2-auth-code-pkce";
import { OpenAPIConfig } from "./_internal";

import { ClientBase } from "./_internal/ClientBase";
import { FetchHttpRequest } from "./_internal/core/FetchHttpRequest";
import type { ApiRequestOptions } from "./_internal/core/ApiRequestOptions";
import { CancelablePromise } from "./_internal/core/CancelablePromise";

class Oauth2FetchHttpRequest extends FetchHttpRequest {
  private oauth: OAuth2AuthCodePKCE | undefined;

  constructor(config: OpenAPIConfig) {
    super(config);
  }

  /**
   * Request method
   * @param options The request options from the service
   * @returns CancelablePromise<T>
   * @throws ApiError
   */
  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return new CancelablePromise<T>(async (resolve, reject, onCancel) => {
      try {
        // If we are authorized fetch the token first
        if (this.oauth && this.oauth.isAuthorized()) {
          const token = await this.oauth.getAccessToken();
          const id_token = token.explicitlyExposedTokens?.id_token;
          this.config.TOKEN = id_token;
        }

        const responsePromise = super.request<T>(options);
        onCancel(() => responsePromise.cancel());

        resolve(responsePromise);
      } catch (error) {
        reject(error);
      }
    });
  }

  public setOAuth2(oauth: OAuth2AuthCodePKCE) {
    this.oauth = oauth;
  }
}

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

    super(openApiConfig, Oauth2FetchHttpRequest);

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
          return;
        }
        const token = await this.oauth.getAccessToken();
        this.id_token = token.explicitlyExposedTokens?.id_token;
        this.request.config.TOKEN = this.id_token;
      });

    // Now that we have our OAuth2AuthCodePKCE instance we need to set
    // it on our request. We have todo this in this convoluted way as we
    // can't access "this" before "super" is call!
    (this.request as Oauth2FetchHttpRequest).setOAuth2(this.oauth);
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
  }

  authorize(): void {
    this.oauth.fetchAuthorizationCode();
  }

  reset(): void {
    this.oauth.reset();
  }
}

export { ClientBase } from "./_internal";
