<script lang="ts">
	import SlnLogo from '../components/SlnLogo.svelte';
	import SlnTokenLogo from '../components/SlnTokenLogo.svelte';
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

			if (token._count) {
				// @ts-ignore
				userTokenAccountValueEth = tokenStats.value * ethers.formatEther(token._count);
				userTokenAccountValueUsd = // @ts-ignore
					(tokenStats.usdPrice * ethers.formatEther(token._count)).toLocaleString('en-US');
			}
		}
	}
</script>

<div>
	{#if token}
		<div id="token-wrapper">
			<div class="card-header-background">
				<div class="flex-center" style="padding: 26px 0;">
					<SlnLogo />
				</div>
				<div class="flex-center" style="margin: 50px 0">
					<SlnTokenLogo />
				</div>
				<div class="field-section flex-between field-wrap">
					<div class="field-container text-center field-50">
						<div class="field-title">Balance</div>
						<div class="field-value">
							{tokenBalance ? formatWithByDecimalPlaces(Number(tokenBalance), 2) + '  $SLN' : '-'}
						</div>
					</div>
					<div class="field-container text-center field-50">
						<div class="field-title">Stake</div>
						<div class="field-value">Coming Soon</div>
					</div>
					<div class="field-container text-center field-50">
						<div class="field-title">Value ETH</div>
						<div class="field-value-alt">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueEth), 2)}
						</div>
					</div>
					<div class="field-container text-center field-50">
						<div class="field-title">Value USD</div>
						<div class="field-value-alt">
							{loading ? '-' : formatWithByDecimalPlaces(Number(userTokenAccountValueUsd), 2)}
						</div>
					</div>
				</div>
			</div>
			<div class="field-section-alt">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Market Value</div>
					<div class="field-icon">
						<svg
							width="22"
							height="22"
							viewBox="0 0 22 22"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clip-path="url(#clip0_2289_13638)">
								<path
									d="M11 1.83331C5.93998 1.83331 1.83331 5.93998 1.83331 11C1.83331 16.06 5.93998 20.1666 11 20.1666C16.06 20.1666 20.1666 16.06 20.1666 11C20.1666 5.93998 16.06 1.83331 11 1.83331ZM11 18.3333C6.95748 18.3333 3.66665 15.0425 3.66665 11C3.66665 6.95748 6.95748 3.66665 11 3.66665C15.0425 3.66665 18.3333 6.95748 18.3333 11C18.3333 15.0425 15.0425 18.3333 11 18.3333ZM11.2841 10.2116C9.66165 9.79915 9.13915 9.34998 9.13915 8.68081C9.13915 7.91081 9.86331 7.36998 11.0641 7.36998C12.3291 7.36998 12.8058 7.97498 12.8425 8.87331H14.41C14.3641 7.64498 13.6125 6.51748 12.1275 6.15081V4.58331H9.99165V6.13248C8.60748 6.42581 7.49831 7.32415 7.49831 8.70831C7.49831 10.3491 8.86415 11.1741 10.8533 11.6508C12.6408 12.0725 12.9983 12.705 12.9983 13.365C12.9983 13.8508 12.6408 14.6391 11.0733 14.6391C9.60665 14.6391 9.02915 13.9791 8.94665 13.1358H7.36998C7.46165 14.6941 8.61665 15.5741 9.99165 15.8583V17.4166H12.1366V15.8858C13.53 15.62 14.63 14.8225 14.6391 13.3466C14.63 11.33 12.8975 10.6333 11.2841 10.2116Z"
									fill="#FFFEFE"
								/>
							</g>
							<defs>
								<clipPath id="clip0_2289_13638">
									<rect width="22" height="22" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</div>
				</div>
				<div class="field-container">
					<div class="field-title">Ethereum</div>
					<div class="field-value-alt">
						{tokenStatsPriceEth ? tokenStatsPriceEth + ' ETH' : '-'}
					</div>
				</div>
				<div class="field-container">
					<div class="field-title">USD</div>
					<div class="field-value-alt">{tokenStatsPriceUsd ? '$' + tokenStatsPriceUsd : '-'}</div>
				</div>
			</div>
			<div class="field-section">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Token</div>
					<svg
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<mask
							id="mask0_2284_13390"
							style="mask-type:luminance"
							maskUnits="userSpaceOnUse"
							x="0"
							y="0"
							width="22"
							height="22"
						>
							<path d="M22 0H0V22H22V0Z" fill="white" />
						</mask>
						<g mask="url(#mask0_2284_13390)">
							<path
								d="M18.9655 13.8866L10.9581 9.21564L2.95068 13.8866L10.9581 18.5576L18.9655 13.8866Z"
								fill="#FFFEFE"
							/>
							<path
								d="M3.75232 10.7L10.9582 6.49658L18.164 10.7L10.9582 14.9034L3.75232 10.7Z"
								fill="#101015"
								stroke="#FFFEFE"
								stroke-width="0.807784"
								stroke-linecap="round"
							/>
							<path
								d="M18.9655 7.08383L10.9581 2.41284L2.95068 7.08383L10.9581 11.7548L18.9655 7.08383Z"
								fill="#FFFEFE"
							/>
						</g>
					</svg>
				</div>
				<div class="field-container">
					<div class="field-title">Name</div>
					<div class="field-value-alt">Smart Token Layer Network</div>
				</div>
				<div class="field-container">
					<div class="field-title">Symbol</div>
					<div class="field-value-alt">SLN</div>
				</div>
				<div class="field-container">
					<div class="field-title">Type</div>
					<div class="field-value-alt">ERC-20</div>
				</div>
				<div class="field-container">
					<div class="field-title">Chain</div>
					<div class="field-value-alt">
						<svg
							style="position: relative; top: 3px; margin-right: 3px;"
							width="19"
							height="19"
							viewBox="0 0 19 19"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9.5 19C14.7467 19 19 14.7467 19 9.5C19 4.25329 14.7467 0 9.5 0C4.25329 0 0 4.25329 0 9.5C0 14.7467 4.25329 19 9.5 19Z"
								fill="#627EEA"
							/>
							<path
								d="M9.79572 2.375V7.64157L14.247 9.63064L9.79572 2.375Z"
								fill="white"
								fill-opacity="0.602"
							/>
							<path d="M9.79574 2.375L5.34381 9.63064L9.79574 7.64157V2.375Z" fill="white" />
							<path
								d="M9.79572 13.0435V16.622L14.25 10.4595L9.79572 13.0435Z"
								fill="white"
								fill-opacity="0.602"
							/>
							<path d="M9.79568 16.622V13.0429L5.34375 10.4595L9.79568 16.622Z" fill="white" />
							<path
								d="M9.79572 12.2153L14.247 9.63064L9.79572 7.64279V12.2153Z"
								fill="white"
								fill-opacity="0.2"
							/>
							<path
								d="M5.34369 9.63064L9.79562 12.2153V7.64279L5.34369 9.63064Z"
								fill="white"
								fill-opacity="0.602"
							/>
						</svg>
						Ethereum Mainnet
					</div>
				</div>
				<div class="field-container">
					<div class="field-title">Release Date</div>
					<div class="field-value-alt">March `24</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
