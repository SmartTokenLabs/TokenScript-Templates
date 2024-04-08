<script lang="ts">
	import SlnLogo from '../components/SlnLogo.svelte';
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import { getStakedData } from './../lib/utils';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	let token: ITokenContextData;
	let tokenStats: any;
	let loading = true;
	let tokenStatsPriceEth: number | string = '-';
	let tokenStatsPriceUsd: number | string = '-';
	let userTokenAccountValueEth: number | string = '-';
	let userTokenAccountValueUsd: number | string = '-';
	let stakeAmount: undefined | number;
	const stakeAddress = '0xE42185196640a4A2dfC668C19872958Db7AdaAC9';

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;

		setTokenPriceData();
		const stakedData = await getStakedData(stakeAddress, token.ownerAddress);
		stakeAmount = stakedData.stakeAmount;

		// You can load other data before hiding the loader
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
			// @ts-ignore
			userTokenAccountValueEth = tokenStats.value * ethers.formatEther(token._count);
			userTokenAccountValueUsd = // @ts-ignore
				(tokenStats.usdPrice * ethers.formatEther(token._count)).toLocaleString('en-US');
		}
	}
</script>

<div>
	{#if token}
		<div id="token-container" style="background: black;color: white;">
			<div class="flex-center" style="margin: 40px 0;">
				<SlnLogo />
			</div>
			<div class="flex-center">
				<div>
					<img
						alt="sln"
						src="https://www.tokenscript.org/images/tokenscript-large-cube.png"
						style="width: 118px"
					/>
					<p style="text-align: center;">Info</p>
				</div>
			</div>
			<div class="field-section">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Account</div>
					<img
						class="field-icon"
						alt="wallet"
						src="https://www.smartlayer.network/_next/static/media/wallet.74ee044d.svg"
					/>
				</div>
				<div class="field-container">
					<div class="field-title">Balance</div>
					<div class="field-value">
						{token._count ? ethers.formatEther(token._count) + '  SLN' : '-'}
					</div>
				</div>
				<div class="field-container">
					<div class="field-title">Staked Balance</div>
					<div class="field-value">
						{stakeAmount ? ethers.formatEther(stakeAmount) + ' SLN' : '-'}
					</div>
				</div>
				<div class="field-container">
					<div class="field-title">Value (ETH)</div>
					<div class="field-value">{loading ? 'loading' : userTokenAccountValueEth}</div>
				</div>
				<div class="field-container">
					<div class="field-title">Value (USD)</div>
					<div class="field-value">{loading ? 'loading' : userTokenAccountValueUsd}</div>
				</div>
			</div>
			<div class="field-section">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Market Value</div>
					<div class="field-icon">$</div>
				</div>
				<div class="field-container">
					<div class="field-title">Ethereum</div>
					<div class="field-value">{tokenStatsPriceEth ? tokenStatsPriceEth + ' ETH' : '-'}</div>
				</div>
				<div class="field-container">
					<div class="field-title">USD</div>
					<div class="field-value">{tokenStatsPriceUsd ? '$' + tokenStatsPriceUsd : '-'}</div>
				</div>
			</div>
			<!-- <div class="field-section">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Exchange Prices</div>
					<div class="field-icon">$</div>
				</div>
				<div class="field-container">
					<div class="field-title">UniSwap</div>
					<div class="field-value">Coming Soon</div>
				</div>
				<div class="field-container">
					<div class="field-title">CoinGecko</div>
					<div class="field-value">Coming Soon</div>
				</div>
				<div class="field-container">
					<div class="field-title">Crypto.com</div>
					<div class="field-value">Coming Soon</div>
				</div>
				<div class="field-container">
					<div class="field-title">Coinmarketcap</div>
					<div class="field-value">Coming Soon</div>
				</div>
			</div> -->
			<div class="field-section">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Token</div>
					<svg
						class="field-icon"
						width="87"
						height="87"
						viewBox="0 0 87 87"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><g clip-path="url(#clip0_6281_9982)"
							><path
								d="M75 54.9154L43.3343 36.4437L11.6686 54.9154L43.3343 73.3871L75 54.9154Z"
								fill="white"
							/><path
								d="M14.8385 42.3137L43.3343 25.6911L71.8302 42.3137L43.3343 58.9363L14.8385 42.3137Z"
								fill="black"
								stroke="white"
								stroke-width="3.19442"
								stroke-linecap="round"
							/><path
								d="M75 28.0134L43.3342 9.54175L11.6685 28.0134L43.3342 46.4851L75 28.0134Z"
								fill="white"
							/></g
						><defs
							><clipPath id="clip0_6281_9982"><rect width="87" height="87" fill="white" /></clipPath
							></defs
						></svg
					>
				</div>
				<div class="field-container">
					<div class="field-title">Name</div>
					<div class="field-value">Smart Token Layer Network</div>
				</div>
				<div class="field-container">
					<div class="field-title">Symbol</div>
					<div class="field-value">SLN</div>
				</div>
				<div class="field-container">
					<div class="field-title">Type</div>
					<div class="field-value">ERC-20</div>
				</div>
				<div class="field-container">
					<div class="field-title">Chain</div>
					<div class="field-value">Mainnet</div>
				</div>
				<div class="field-container">
					<div class="field-title">Release Date</div>
					<div class="field-value">March `24</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
