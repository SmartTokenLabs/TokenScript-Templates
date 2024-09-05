<script lang="ts">
	import context from './lib/context';
	import Info from './routes/Info.svelte';
	import NotFound from './routes/NotFound.svelte';

	import Messages from './routes/Messages.svelte';
	import Friendship from './routes/Friendship.svelte';
	import { Token } from './lib/types';
	import OperationStatus from './components/OperationStatus.svelte';
	import LoaderGlobal from './components/LoaderGlobal.svelte';

	let token: Token;
	let initialised = false;

	// const routingMap: { [index: string]: typeof Messaging } = {
	const routingMap: { [index: string]: any } = {
		'#messages': Messages,
		'#friendship': Friendship,
		'#info': Info
	};

	let page: any;

	function routeChange() {
		page = routingMap[document.location.hash || '#messages'] || NotFound;
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
	<OperationStatus/>
	<LoaderGlobal />
</div>

<style lang=scss>
	#token-container {
		padding: 0 35px;
		@media (max-width: 480px){
			padding: 0 15px;
		}
	}
	:global(body) {
		margin: 0;
	}
</style>
