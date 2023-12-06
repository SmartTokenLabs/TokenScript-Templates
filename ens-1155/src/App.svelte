<script lang="ts">
	import context from "./lib/context";
	import Info from "./routes/Info.svelte";
	import NotFound from "./routes/NotFound.svelte";

	import Renew from "./routes/Renew.svelte";
	import Record from "./routes/Record.svelte";

	let token;
	let initialised = false;

	const routingMap = {
		'#info': Info,
		'#renew': Renew,
		'#record': Record,
	};

	let page;

	function routeChange() {
		page = routingMap[token.level == 0 ? "#adopt" : document.location.hash] || NotFound;
	}

	// @ts-ignore
	web3.tokens.dataChanged = async (oldTokens, updatedTokens, cardId) => {

		if (initialised)
			return;

		context.setToken(updatedTokens.currentInstance);
		token = updatedTokens.currentInstance;

		initialised = true;

		routeChange();
	};

</script>

<svelte:window on:hashchange={routeChange} />

<div>
	<div id="token-container">
		<svelte:component this={page} />
	</div>
</div>
