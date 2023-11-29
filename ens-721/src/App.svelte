
<script lang="ts">
	import context from "./lib/context";
	import Info from "./routes/Info.svelte";
	import NotFound from "./routes/NotFound.svelte";
	import { Buffer } from "buffer";
	// @ts-ignore
	import * as namehash from "@ensdomains/eth-ens-namehash";
	import Renew from "./routes/Renew.svelte";
	import Record from "./routes/Record.svelte";
	import Loader from "./components/Loader.svelte";

	let token;
	let initialised = false;
	window.Buffer = Buffer;

	const routingMap = {
		'#info': Info,
		'#renew': Renew,
		'#record': Record
	};

	let page;

	function routeChange() {
		page = routingMap[document.location.hash] || NotFound;
	}

	// @ts-ignore
	web3.tokens.dataChanged = async (oldTokens, updatedTokens, cardId) => {

		if (initialised)
			return;

		context.setToken(updatedTokens.currentInstance);
		token = updatedTokens.currentInstance;
		token.baseNode = ".eth";
		token.fullName = token.ensName + token.baseNode;

		if(!token.resolverAddress) {
			// @ts-ignore
			web3.action.setProps({
				nodeHash: namehash.hash(token.fullName)
			});
			return;
		}

		initialised = true;

		routeChange();

	};

</script>

<style>
	.init-loader {
		min-height: 97vh !important;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

<svelte:window on:hashchange={routeChange} />

<div>
	<div id="token-container">
		{#if !initialised}
			<div class="init-loader">
				<Loader show={true} />
			</div>
		{/if}
		<svelte:component this={page} />
	</div>
</div>
