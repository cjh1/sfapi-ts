import {
  Configuration,
  OAuth2AuthCodePKCE,
  AccessContext,
  fromWWWAuthenticateHeaderStringToObject,
  toErrorClass,
  ErrorInvalidToken,
  ErrorNoAuthCode,
} from "@bity/oauth2-auth-code-pkce";
import { ApiError, OpenAPIConfig } from "./_internal";

import { ClientBase } from "./_internal/ClientBase";
import { FetchHttpRequest } from "./_internal/core/FetchHttpRequest";
import type { ApiRequestOptions } from "./_internal/core/ApiRequestOptions";
import { CancelablePromise } from "./_internal/core/CancelablePromise";
import { UtilitiesService } from "./services/UtilitiesService";

const HEADER_WWW_AUTHENTICATE = "WWW-Authenticate";

class Oauth2FetchHttpRequest extends FetchHttpRequest {
  private oauth: OAuth2AuthCodePKCE | undefined;
  private onAccessTokenExpiry:
    | ((
        refreshAccessToken: () => Promise<AccessContext>
      ) => Promise<AccessContext>)
    | undefined;

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
      // Request the WWW-Authenticate header so we can handle token expiry
      options = { responseHeader: HEADER_WWW_AUTHENTICATE, ...options };

      try {
        if (this.oauth) {
          try {
            //this.config.TOKEN = undefined;
            const token = await this.oauth.getAccessToken();
            const accessToken = token.token?.value;

            let headers: Record<string, any> = {};
            if (options.headers) {
              headers = options.headers;
            }
            headers["Authorization"] = `Bearer ${accessToken}`;

            options = { headers, ...options };
          } catch (error) {
            // If we don't have a auth code move on without the token
            if (!(error instanceof ErrorNoAuthCode)) {
              throw error;
            }
          }
        }

        const responsePromise = super.request<T>(options);

        onCancel(() => responsePromise.cancel());

        const response = await responsePromise;

        resolve(response);
      } catch (error) {
        // Intercept expired token errors and try again
        if (error instanceof ApiError) {
          // If we have an erro in the WWW-Authenticate header check the type
          if (
            typeof error.body === "string" &&
            error.body.includes("Bearer error=")
          ) {
            const errorInstance = toErrorClass(
              fromWWWAuthenticateHeaderStringToObject(error.body).error
            );

            if (
              errorInstance instanceof ErrorInvalidToken &&
              this.oauth &&
              this.onAccessTokenExpiry
            ) {
              this.onAccessTokenExpiry(() =>
                (
                  this.oauth as OAuth2AuthCodePKCE
                ).exchangeRefreshTokenForAccessToken()
              );
            }
          }
        }

        reject(error);
      }
    });
  }

  public setOAuth2(
    oauth: OAuth2AuthCodePKCE,
    onAccessTokenExpiry: (
      refreshAccessToken: () => Promise<AccessContext>
    ) => Promise<AccessContext>
  ) {
    this.oauth = oauth;
    this.onAccessTokenExpiry = onAccessTokenExpiry;
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
   * @param scopes - The scopes to request
   * @param apiBaseUrl - The base URL for the SF API instance
   * @param onAccessTokenExpiry - Callback for token expiry
   * @param onInvalidGrant - Callback for invalid grant
   */
  constructor(
    clientID: string,
    redirectUrl: URL,
    authorizationUrl: URL,
    tokenUrl: URL,
    scopes: string[],
    apiBaseUrl: URL,
    onAccessTokenExpiry: (
      refreshAccessToken: () => Promise<AccessContext>
    ) => Promise<AccessContext>,
    onInvalidGrant: (refreshAuthCodeOrRefreshToken: () => Promise<void>) => void
  ) {
    const openApiConfig: Partial<OpenAPIConfig> = {
      BASE: apiBaseUrl.toString(),
    };

    super(openApiConfig, Oauth2FetchHttpRequest);

    // Override the utilities service so we get progress
    type WritableClient = {
      -readonly [key in keyof Client]: Client[key];
    };

    const writable: WritableClient = this;

    const config: Configuration = {
      clientId: clientID,
      redirectUrl: redirectUrl.toString(),
      authorizationUrl: authorizationUrl.toString(),
      tokenUrl: tokenUrl.toString(),
      scopes,
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
      onAccessTokenExpiry,
      onInvalidGrant,
    };

    this.oauth = new OAuth2AuthCodePKCE(config);

    writable.utilities = new UtilitiesService(this.request, this.oauth);

    // Now that we have our OAuth2AuthCodePKCE instance and callback we
    // need to set it on our request. We have todo this in this convoluted
    // way as we can't access "this" before "super" is call!
    (this.request as Oauth2FetchHttpRequest).setOAuth2(
      this.oauth,
      onAccessTokenExpiry
    );

    // This is needed, as the sideffect is the parse the access token!
    this.oauth.isReturningFromAuthServer();
  }

  public authorize(): void {
    this.oauth.fetchAuthorizationCode();
  }

  public reset(): void {
    this.oauth.reset();
  }

  public isAuthorized(): boolean {
    return this.oauth.isAuthorized();
  }

  public isReturningFromAuthServer(): Promise<boolean> {
    return this.oauth.isReturningFromAuthServer();
  }
}

export { ClientBase } from "./_internal";
