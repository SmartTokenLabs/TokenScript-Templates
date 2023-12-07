<script lang="ts">
	import context from "./lib/context";
	import Info from "./routes/Info.svelte";
	import NotFound from "./routes/NotFound.svelte";

	import Renew from "./routes/Renew.svelte";
	import Record from "./routes/Record.svelte";
	import {decimalToHex, hexToAscii, santitiseEnsName} from "./lib/utils";
	import {getEnsContract} from "./lib/abi";
	import {namehash} from "ethers";
	import Loader from "./components/Loader.svelte";

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

	async function resolveEnsName() {
		try {
			const ensContract = getEnsContract();
			const tokenIdToHex = decimalToHex(token.tokenId);
			const rawENSName = await ensContract.names(tokenIdToHex);
			const rawNameToAscii = hexToAscii(rawENSName);
			const { baseName, subName } = santitiseEnsName(rawNameToAscii);
			const ensName = subName ? subName : baseName;
			const nameHash = namehash(ensName);
			const baseNameHash = namehash(baseName);
			const tokenDataRes = await ensContract.getData(baseNameHash);

			const data = {
				ensName,
				ensBaseName: baseName,
				registeredName: baseName.replace(".eth", ""),
				subName: subName,
				nameHash,
				expiry: tokenDataRes[2]
			}

			console.log("Data: ", data);

			// @ts-ignore
			web3.action.setProps(data);

		} catch (error) {
			console.log('error', error);
		}
	}

	// @ts-ignore
	web3.tokens.dataChanged = async (oldTokens, updatedTokens, cardId) => {

		if (initialised)
			return;

		context.setToken(updatedTokens.currentInstance);
		token = updatedTokens.currentInstance;

		if(!token.ensBaseName) {
			await resolveEnsName();
			return;
		}

		initialised = true;

		routeChange();
	};

</script>

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
