<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	import { formatWithByDecimalPlaces, chainConfig } from '../lib/utils';
	import Dollar from '../components/Dollar.svelte';
	let token: ITokenContextData;
	let tokenStats: any;
	let loading = true;
	let tokenStatsPriceEth: number | string = '-';
	let tokenStatsPriceUsd: number | string = '-';
	let userTokenAccountValueEth: number | string = '-';
	let userTokenAccountValueUsd: number | string = '-';
	let tokenBalance: number | string | undefined;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;

		await setTokenPriceData();

		// @ts-ignore
		tokenBalance = token._count ? ethers.formatEther(token._count) : 0;

		loading = false;
	});

	async function setTokenPriceData() {
		const tokenStatsRequest = await fetch(
			`https://api.token-discovery.tokenscript.org/get-token-price?blockchain=evm&smartContract=0x514910771af9ca656af840dff83e8264ecf986ca&chain=eth`
		);
		tokenStats = await tokenStatsRequest.json();
		if (tokenStats.value && tokenStats.usdPrice) {
			tokenStatsPriceEth = tokenStats.value ?? 'not found';
			tokenStatsPriceUsd = tokenStats?.usdPrice?.toLocaleString('en-US') ?? 'not found';

			if (token._count) {
				// @ts-ignore
				userTokenAccountValueEth = tokenStats.value * ethers.formatEther(token._count);
				userTokenAccountValueUsd =
					Number(tokenStats.usdPrice) * Number(ethers.formatEther(token._count)); // @ts-ignore
			}
		}
	}
</script>

<div>
	{#if token}
		<div
			id="token-wrapper"
			style="background: no-repeat linear-gradient(180deg, #000, #2B2F44); background-size: 100% 20%; background-position: bottom;"
			class="text-white"
		>
			<div class="card-header-background">
				<div class="text-center text-2xl pt-12 pb-8">{token.name}</div>
				<div class="text-center">
					<div class="text-lg text-gray-400">Your Balance</div>
					<div class="text-xl font-semibold field-value">
						{tokenBalance
							? formatWithByDecimalPlaces(Number(tokenBalance), 2) + '  $' + token.symbol
							: '-'}
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4 my-12">
					<div class="text-center">
						<div class="text-sm text-gray-400">Value ETH</div>
						<div class="text-lg font-semibold">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueEth), 2)}
						</div>
					</div>
					<div class="text-center">
						<div class="text-sm text-gray-400">Value USD</div>
						<div class="text-lg font-semibold">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueUsd), 2)}
						</div>
					</div>
				</div>
			</div>
			<div class="p-6" style="background-color: #1E233C;">
				<div class="flex items-center justify-between">
					<div class="text-lg font-semibold">Market Value</div>
					<div class="w-6 h-6">
						<Dollar />
					</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Ethereum</div>
					<div class="text-lg font-semibold">
						{tokenStatsPriceEth ? tokenStatsPriceEth.toString().substring(0, 6) + ' ETH' : '-'}
					</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">USD</div>
					<div class="text-lg font-semibold">
						{tokenStatsPriceUsd
							? '$' + formatWithByDecimalPlaces(Number(tokenStatsPriceUsd), 2)
							: '-'}
					</div>
				</div>
			</div>
			<div class="p-6">
				<div class="flex items-center justify-between">
					<div class="text-lg font-semibold">Token</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Name</div>
					<div class="text-lg font-semibold">{token.name}</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Symbol</div>
					<div class="text-lg font-semibold">{token.symbol}</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Type</div>
					<div class="text-lg font-semibold">ERC-20</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Chain</div>
					<div style="margin-left: 2px; margin-top: 1.5px;" class="text-lg font-semibold">
						{chainConfig[token.chainId].name}
					</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
