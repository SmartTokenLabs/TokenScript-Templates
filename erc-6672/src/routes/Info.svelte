

<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";
	import {Token} from "../lib/types";
	import { redirect } from "@sveltejs/kit";

	let token: Token;
	let loading = true;
	

	context.data.subscribe(async (value) => {
		if (!value.token)
			return;
		token = value.token;
		// You can load other data before hiding the loader
		

		loading = false;
	});
	
</script>

<div>
	{#if token}
		<div style="text-align: center;">
			<h3>Welcome to TokenScript</h3>
			<p>When a card loads in TokenScript, it gets access to the token context data through TokenScript engine</p>
		</div>
		<pre>{JSON.stringify(token, null, 2)}</pre>

	{/if}
	<Loader show={loading}/>
</div>

<style>
	pre {
		font-size: 0.8em;
	}
</style>