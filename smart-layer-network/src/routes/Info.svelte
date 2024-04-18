<script lang="ts">
	import SlnLogo from '../components/SlnLogo.svelte';
	import SlnTokenLogo from '../components/SlnTokenLogo.svelte';
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	import { formatWithByDecimalPlaces } from '../lib/utils';
	import Dollar from '../components/Dollar.svelte';
	import SlnLogo2 from '../components/SLNLogo2.svelte';
	import EthLogo from '../components/EthLogo.svelte';
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
			`https://api.token-discovery.tokenscript.org/get-token-price?blockchain=evm&smartContract=0xdb82c0d91e057e05600c8f8dc836beb41da6df14&chain=eth`
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
			style="background: no-repeat linear-gradient(180deg, #171822, #2B2F44); background-size: 100% 20%; background-position: bottom;"
			class="text-white"
		>
			<div class="card-header-background">
				<div class="flex items-center justify-center py-6">
					<SlnLogo />
				</div>
				<div class="flex items-center justify-center my-12">
					<SlnTokenLogo />
				</div>
				<div class="grid grid-cols-2 gap-4 my-12">
					<div class="text-center">
						<div class="text-sm text-gray-400">Balance</div>
						<div class="text-lg font-semibold">
							{tokenBalance ? formatWithByDecimalPlaces(Number(tokenBalance), 2) + '  $SLN' : '-'}
						</div>
					</div>
					<div class="text-center">
						<div class="text-sm text-gray-400">Stake</div>
						<div class="text-lg font-semibold">Coming Soon</div>
					</div>
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
						{tokenStatsPriceEth ? tokenStatsPriceEth + ' ETH' : '-'}
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
					<div class="w-6 h-6">
						<SlnLogo2 />
					</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Name</div>
					<div class="text-lg font-semibold">Smart Layer Network</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Symbol</div>
					<div class="text-lg font-semibold">SLN</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Type</div>
					<div class="text-lg font-semibold">ERC-20</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Chain</div>
					<div class="flex items-center">
						<div class="w-6 h-6">
							<EthLogo />
						</div>
						<div class="ml-2">Ethereum Mainnet</div>
					</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Release Date</div>
					<div class="text-lg font-semibold">March `24</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
