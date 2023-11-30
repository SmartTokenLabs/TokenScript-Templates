
<script lang="ts">
	import context from "./lib/context";
	import Info from "./routes/Info.svelte";
	import NotFound from "./routes/NotFound.svelte";

	import Messaging from "./routes/Messaging.svelte";
	import { Token } from "./lib/types";

	let token: Token;
	let initialised = false;

	const routingMap: {[index:string]: typeof Messaging } = {
		'#messaging': Messaging,
		'#info': Info,
	};

	let page: any;

	function routeChange() {
		page = routingMap[document.location.hash||'#messaging'] || NotFound;
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

<style global>
	.loader-modal {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
</style>