<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	import { formatWithByDecimalPlaces, chainConfig, formatTokenBalance } from '../lib/utils';
	let token: ITokenContextData;
	let tokenStats: any;
	let loading = true;
	let tokenStatsPriceEth: number | string = '-';
	let tokenStatsPriceUsd: number | string = '-';
	let userTokenAccountValueEth: number;
	let userTokenAccountValueUsd: number;
	let tokenBalance: number | string | undefined;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		tokenBalance = formatTokenBalance(token?._count, token?.decimals);
		await setTokenPriceData();
		loading = false;
	});

	async function setTokenPriceData() {
		const tokenStatsRequest = await fetch(
			`https://api.token-discovery.tokenscript.org/get-token-price?blockchain=evm&smartContract=0x6982508145454ce325ddbe47a25d4ec3d2311933&chain=eth`
		);
		tokenStats = await tokenStatsRequest.json();
		if (tokenStats.value && tokenStats.usdPrice) {
			tokenStatsPriceEth = tokenStats.value ?? 'not found';
			tokenStatsPriceUsd = tokenStats?.usdPrice?.toLocaleString('en-US') ?? 'not found';

			if (token._count) {
				// @ts-ignore
				userTokenAccountValueEth = Number(tokenStats.value) * Number(tokenBalance);
				userTokenAccountValueUsd = Number(tokenStats.usdPrice) * Number(tokenBalance); // @ts-ignore
			}
		}
	}

</script>

<div>
	{#if token}
		<div class="iframe-wrap" style="margin: 40px 0;">
			<div style="text-align: center;">
				<div style="display: flex; justify-content: center;">
					<img style="border-radius: 100%; width: 20%;" src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/pepe-avatar.png">
				</div>
				<h2 style="margin: 24px 0 12px 0;">PEPE</h2>
			</div>
			<div class="text-center mb-6">
				<div class="text-lg secondary-font-colour">Your Balance</div>
				<div class="text-xl font-semibold field-value">
					{tokenBalance
						? formatWithByDecimalPlaces(Number(tokenBalance), 2) + '  $PEPE'
						: '-'}
				</div>
			</div>
			{#if (Number(userTokenAccountValueUsd) > 0.01)}
				<div class="grid grid-cols-2 gap-4 my-12">
					<div class="text-center">
						<div class="text-sm secondary-font-colour">Value ETH</div>
						<div class="text-lg font-semibold">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueEth), 5)}
						</div>
					</div>
					<div class="text-center">
						<div class="text-sm secondary-font-colour">Value USD</div>
						<div class="text-lg font-semibold">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueUsd), 2)}
						</div>
					</div>
				</div>
			{/if}
			<div class="p-6 secondary-background-color rounded-[8px]">
				<div class="flex items-center justify-between text-white">
					<div class="text-lg font-semibold">Market Value</div>
				</div>
				<div class="mt-4 text-white">
					<div class="text-sm primary-font-color">Ethereum</div>
					<div class="text-lg font-semibold">
						{tokenStatsPriceEth ? tokenStatsPriceEth.toString().substring(0, 12) + ' ETH' : '-'}
					</div>
				</div>
			</div>
			<div class="mt-6 pl-6">
				<div class="flex items-center justify-between">
					<div class="text-lg font-semibold">Token</div>
				</div>
				<div class="mt-4">
					<div class="text-sm secondary-font-colour">Symbol</div>
					<div class="text-lg font-semibold">PEPE</div>
				</div>
				<div class="mt-4">
					<div class="text-sm secondary-font-colour">Type</div>
					<div class="text-lg font-semibold">ERC-20</div>
				</div>
				<div class="mt-4">
					<div class="text-sm secondary-font-colour">Chain</div>
					<div style="margin-left: 2px; margin-top: 1.5px;" class="text-lg font-semibold">
						ETH MAINNET
					</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
