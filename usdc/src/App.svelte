<script lang="ts">
	import context from './lib/context';
	import Bridge from './routes/Bridge.svelte';
	import Info from './routes/Info.svelte';
	import NotFound from './routes/NotFound.svelte';
	import Send from './routes/Send.svelte';
	import Buy from './routes/Buy.svelte';
	import './tailwind.css';

	let token;
	let initialised = false;

	const routingMap = {
		'#info': Info,
		'#send': Send,
		'#bridge': Bridge,
		'#buy': Buy
	};

	let page;

	function routeChange() {
		page = routingMap[document.location.hash] || NotFound;
	}

	// @ts-ignore
	web3.tokens.dataChanged = async (oldTokens, updatedTokens, cardId) => {
		
		if (initialised) return;

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
