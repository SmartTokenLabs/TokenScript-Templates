<script lang="ts">
  import { currentHash } from "../store"

  type $$Props =
    | {
        type: "token"
        name: string
        contractId: string
      }
    | {
        type: "action"
        name: string
        contractId: string
        function?: string
      }
</script>

{#if "#" + $$props.name.toLowerCase() === $currentHash}
  <slot />
{/if}
