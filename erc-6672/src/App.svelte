
<script lang="ts">
	import context from "./lib/context";
	import { Token } from "./lib/types";
	import Info from "./routes/Info.svelte";
	import Operators from "./routes/Operators.svelte";
	import NotFound from "./routes/NotFound.svelte";

	import Mint from "./routes/Mint.svelte";
	import AddOperator from "./routes/AddOperator.svelte";
	import Cancel from "./routes/Cancel.svelte";
	import Redeem from "./routes/Redeem.svelte";

	let token: Token;
	let initialised = false;

	const routingMap = {
		'#info': Info,
		'#mint': Mint,
		'#operators': Operators,
		'#addOperator': AddOperator,
		'#cancel': Cancel,
		'#redeem': Redeem,
	};

	let page;

	function routeChange() {
		page = routingMap[token.level == 0 ? "#operators" : document.location.hash] || NotFound;
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
