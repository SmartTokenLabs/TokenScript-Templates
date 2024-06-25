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
	let userTokenAccountValueEth: number | string = '-';
	let userTokenAccountValueUsd: number | string = '-';
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
			`https://api.token-discovery.tokenscript.org/get-token-price?blockchain=evm&smartContract=0xdac17f958d2ee523a2206206994597c13d831ec7&chain=eth`
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
		<div id="token-wrapper" class="primary-font-color">
			<div class="card-header-background">
				<div class="text-center text-2xl pt-12 pb-6 text-[#385bd2] flex justify-center">
					<img
						style="width: 130px"
						alt="dai logo"
						src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/tether-logo-with-text.png"
					/>
				</div>
				<div class="text-center">
					<div class="text-lg secondary-font-color">Your Balance</div>
					<div class="text-xl font-semibold field-value">
						{tokenBalance
							? formatWithByDecimalPlaces(Number(tokenBalance), 2) + '  $' + token.symbol
							: '-'}
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4 my-12">
					<div class="text-center">
						<div class="text-sm secondary-font-color">Value ETH</div>
						<div class="text-lg font-semibold">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueEth), 5)}
						</div>
					</div>
					<div class="text-center">
						<div class="text-sm secondary-font-color">Value USD</div>
						<div class="text-lg font-semibold">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueUsd), 2)}
						</div>
					</div>
				</div>
			</div>
			<div class="p-6 secondary-background-color">
				<div class="flex items-center justify-between text-white">
					<div class="text-lg font-semibold">Market Value</div>
				</div>
				<div class="mt-4 text-white">
					<div class="text-sm">Ethereum</div>
					<div class="text-lg font-semibold">
						{tokenStatsPriceEth ? tokenStatsPriceEth.toString().substring(0, 6) + ' ETH' : '-'}
					</div>
				</div>
				<div class="mt-4 text-white">
					<div class="text-sm">USD</div>
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
					<div class="text-sm secondary-font-color">Name</div>
					<div class="text-lg font-semibold">{token.name ?? '-'}</div>
				</div>
				<div class="mt-4">
					<div class="text-sm secondary-font-color">Symbol</div>
					<div class="text-lg font-semibold">{token.symbol ?? '-'}</div>
				</div>
				<div class="mt-4">
					<div class="text-sm secondary-font-color">Type</div>
					<div class="text-lg font-semibold">ERC-20</div>
				</div>
				<div class="mt-4">
					<div class="text-sm secondary-font-color">Chain</div>
					<div style="margin-left: 2px; margin-top: 1.5px;" class="text-lg font-semibold">
						{chainConfig[token.chainId].name}
					</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
