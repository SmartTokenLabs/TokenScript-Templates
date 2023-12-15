<script lang="ts">
	import context from './lib/context';
	import Info from './routes/Info.svelte';
	import SendEth from './routes/SendEth.svelte';
	import SendErc20 from './routes/SendErc20.svelte';
	import NotFound from './routes/NotFound.svelte';

	let token;
	let initialised = false;

	const routingMap = {
		'#info': Info,
		'#sendEth': SendEth,
		'#sendErc20': SendErc20
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

		const data = { testing: 123 };

		// @ts-ignore
		web3.action.setProps(data);

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
