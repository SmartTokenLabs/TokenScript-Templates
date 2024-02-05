<script lang="ts">
	import context from './lib/context';
	import Profile from './routes/Profile.svelte';
	import Items from './routes/Items.svelte';
	import Friends from './routes/Friends.svelte';
	import Points from './routes/Points.svelte';
	import Contents from './routes/Contents.svelte';
	import NotFound from './routes/NotFound.svelte';

	let token;
	let initialised = false;

	const routingMap = {
		'#profile': Profile,
		'#points': Points,
		'#items': Items,
		'#contents': Contents,
		'#friends': Friends
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
