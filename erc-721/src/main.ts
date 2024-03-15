import App from "./App.svelte"
import "@tokenscript/card-sdk/src/tokenscript.d.ts";

const app = new App({
  target: document.body,
})

export default app
