<script lang="ts">
  import { type SvelteComponent } from "svelte"

  import context from "./lib/context"
  import Info from "./routes/Info.svelte"
  import NotFound from "./routes/NotFound.svelte"
  import Transfer from "./routes/transfer.svelte"
  import Burn from "./routes/burn.svelte"
  import { Token } from "./type"

  let token: Token

  let initialized = false

  type Page = typeof SvelteComponent
  interface RoutingMap {
    [key: string]: Page
  }

  const routingMap: RoutingMap = {
    "#info": Info as Page,
    "#transfer": Transfer as Page,
    "#burn": Burn as Page,
  }

  let page: Page

  function routeChange() {
    page = routingMap[document.location.hash] || NotFound
  }

  // @ts-ignore  TODO:
  web3.tokens.dataChanged = async (oldTokens, updatedTokens, cardId) => {
    if (initialized) {
      return
    }

    context.setToken(updatedTokens.currentInstance)
    token = updatedTokens.currentInstance

    initialized = true

    routeChange()
  }
</script>

<svelte:window on:hashchange={routeChange} />

<div id="token-container">
  <svelte:component this={page} />
</div>
