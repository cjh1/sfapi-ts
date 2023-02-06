import { setupLogin, setupStatus } from "./login";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Login</h1>
    <div class="card">
      <button id="login" type="button">Login</button>
      <button id="status" type="button">Status</button>
    </div>
  </div>
`;

setupLogin(document.querySelector<HTMLButtonElement>("#login")!);
setupStatus(document.querySelector<HTMLButtonElement>("#status")!);
