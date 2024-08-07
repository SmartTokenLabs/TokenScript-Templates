<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	import { formatWithByDecimalPlaces } from '../lib/utils';
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
				userTokenAccountValueEth = Number(tokenStats.value) * ethers.formatEther(token._count);
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
					<img
						src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/sln/sln-logo-5.svg"
						alt="sln logo"
					/>
					<img
						style="margin: 2px 0 0 8px;"
						src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/sln/smart-layer-logo-font.svg"
						alt="sln logo text"
					/>
				</div>
				<div class="flex items-center justify-center my-12">
					<img
						alt="sln logo"
						src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/sln/SlnTokenLogo.svg"
					/>
				</div>
				<div class="grid grid-cols-2 gap-4 my-12">
					<div class="text-center">
						<div class="text-sm text-gray-400">Balance</div>
						<div class="text-lg font-semibold field-value">
							{tokenBalance ? formatWithByDecimalPlaces(Number(tokenBalance), 2) + '  $SLN' : '-'}
						</div>
						{#if token.chainId === 1}
							<div class="field-value-alt flex justify-center mt-1">
								<img
									style="height: 18px;"
									alt="chain"
									src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/ethereum.svg"
								/>
							</div>
						{/if}
						{#if token.chainId === 137}
							<div class="field-value-alt flex justify-center mt-1">
								<img
									style="height: 18px"
									alt="chain"
									src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/Polygon.svg"
								/>
							</div>
						{/if}
						{#if token.chainId === 8217}
							<div class="field-value-alt flex justify-center mt-1">
								<img
									style="height: 18px"
									alt="chain"
									src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/klaytn-symbol.svg"
								/>
							</div>
						{/if}
					</div>
					<div class="text-center">
						<div class="text-sm text-gray-400">Staking</div>
						<div class="text-lg font-semibold field-value">Coming Soon</div>
					</div>
					<div class="text-center">
						<div class="text-sm text-gray-400">Value ETH</div>
						<div class="text-lg font-semibold">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueEth), 5)}
						</div>
					</div>
					<div class="text-center">
						<div class="text-sm text-gray-400">Value USD</div>
						<div class="text-lg font-semibold">
							{loading ? '-' : `$${formatWithByDecimalPlaces(Number(userTokenAccountValueUsd), 2)}`}
						</div>
					</div>
				</div>
			</div>
			<div class="p-6" style="background-color: #1E233C;">
				<div class="flex items-center justify-between">
					<div class="text-lg font-semibold">Market Value</div>
					<img
						alt="dollar icon"
						src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/icons/Dollar.svg"
					/>
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
					<div class="w-6 h-6">
						<img
							alt="sln logo"
							src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/sln/SLNLogo2.svg"
						/>
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
						{#if token.chainId === 1}
							<div class="flex">
								<div style="margin-right: 7px; margin-top: 1.5px;" class="text-lg font-semibold">
									Ethereum Mainnet
								</div>
								<div class="field-value-alt flex">
									<img
										style="height: 24px; width: 17px; margin-top: 2px;"
										alt="chain"
										src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/ethereum.svg"
									/>
								</div>
							</div>
						{/if}
						{#if token.chainId === 137}
							<div class="flex">
								<div style="margin-right: 7px; margin-top: 1.5px;" class="text-lg font-semibold">
									Polygon
								</div>
								<div class="field-value-alt flex">
									<img
										style="height: 24px; width: 17px; margin-top: 2px;"
										alt="chain"
										src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/Polygon.svg"
									/>
								</div>
							</div>
						{/if}
						{#if token.chainId === 8217}
							<div class="flex">
								<div style="margin-right: 7px; margin-top: 1.5px;" class="text-lg font-semibold">
									Klaytn
								</div>
								<div class="field-value-alt flex">
									<img
										style="height: 24px; width: 17px; margin-top: 2px;"
										alt="chain"
										src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/klaytn-symbol.svg"
									/>
								</div>
							</div>
						{/if}
					</div>
				</div>
				<div class="mt-4">
					<div class="text-sm text-gray-400">Release Date</div>
					<div class="text-lg font-semibold">Feb `24</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
