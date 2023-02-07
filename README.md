# sfapi-ts

A TypeScript client for the SF API. Generated from the OpenAPI specification. The generated code is automatically refactored using [ts-morph](https://ts-morph.com/) to provide more friendly naming.

## Example usage

```typescript
  client = new Client(
    OIDC_CLIENT_ID,
    new URL(REDIRECT_URL),
    new URL(AUTH_URL),
    new URL(TOKEN_URL),
    new URL(API_URL)
  );
  
  client.authorize()
  
  const status = await client.status.getStatus();
  console.log(status);

  const coriStatus = await client.status.getStatusBySystem("cori");
  console.log(coriStatus);

  const roles = await client.account.getRoles();
  console.log(roles);
```

## API Documentation

The full [__API reference__](https://cjh1.github.io/sfapi-ts/sfapi.html) can be found [here](https://cjh1.github.io/sfapi-ts/sfapi.html).
