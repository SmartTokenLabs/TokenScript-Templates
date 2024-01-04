<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";

	let token;
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
		<h3>Mint...</h3>
		<p>Actions allow you to invoke a smart contract transaction or invoke a Javascript function within the view.</p>
	{/if}
	<Loader show={loading}/>
</div>
