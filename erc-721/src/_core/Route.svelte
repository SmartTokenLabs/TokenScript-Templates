<script lang="ts">
	import { currentHash } from './store';

	export let path: string;
</script>

{#if '#' + path === $currentHash}
	<slot />
{/if}
