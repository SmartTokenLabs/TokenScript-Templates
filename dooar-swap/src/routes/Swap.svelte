
<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";
	import type {ITokenContextData} from "@tokenscript/card-sdk/dist/types";
	import Swap from "../components/Swap.svelte";

	let loading = true;
	let token: ITokenContextData;

	context.data.subscribe(async (value) => {
		if (!value.token)
			return;
		token = value.token;
		//console.log(token.morchiInfo);
		// You can load other data before hiding the loader
		loading = false;
	});

</script>

<style>

</style>

<Loader show={loading}/>

{#if token}
	<Swap token={token}/>
{/if}