<script lang="ts">
  import context from "../../lib/context"
  import { currentHash } from "../store"

  let initialized = false

  function hashChange() {
    $currentHash = window.location.hash
  }

  // @ts-ignore  TODO:
  web3.tokens.dataChanged = async (oldTokens, updatedTokens, cardId) => {
    if (initialized) {
      return
    }

    context.setToken(updatedTokens.currentInstance)

    initialized = true

    hashChange()
  }
</script>

<svelte:window on:hashchange={hashChange} />

<slot />
