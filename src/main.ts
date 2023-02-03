import { setupLogin } from "./login";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Login</h1>
    <div class="card">
      <button id="login" type="button">Login</button>
    </div>
  </div>
`;

setupLogin(document.querySelector<HTMLButtonElement>("#login")!);
