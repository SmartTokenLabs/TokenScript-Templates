<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import Web3Logo from '../components/Web3Logo.svelte';
	import CardArrow from '../components/CardArrow.svelte';
	import MagnifyingGlass from '../components/MagnifyingGlass.svelte';
	import Close from '../components/Close.svelte';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';

	let token: ITokenContextData;
	let loading = true;
	let timeout: any;
	let searchString: string;

	const swaps = [
		{
			title: 'BitTrue',
			type: 'cex',
			logo: 'BitTrue',
			url: 'https://www.bitrue.com/trade/usdt_[TOKEN]'
		},
		{
			title: 'CoinOne',
			type: 'cex',
			logo: 'CoinOne',
			url: 'https://coinone.co.kr/exchange/trade/[TOKEN]/krw'
		},
		{
			title: 'Crypto.com',
			type: 'cex',
			logo: 'CryptoCOM',
			url: 'https://crypto.com/price/usd-coin'
		},
		{
			title: 'DragonSwap',
			type: 'dex',
			logo: 'DragonSwap',
			url: 'https://dgswap.io/swap?inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7&outputCurrency=[TOKEN_ADDRESS]'
		},
		{
			title: 'Gate.io',
			type: 'cex',
			logo: 'GateIO',
			url: 'https://www.gate.io/trade/[TOKEN]_USDT'
		},
		{
			title: 'OKX',
			type: 'cex',
			logo: 'OKX',
			url: 'https://www.okx.com/web3/dex-swap#inputChain=1&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7&outputChain=1&outputCurrency=[TOKEN_ADDRESS]'
		},
		{
			title: 'kucoin',
			type: 'cex',
			logo: 'Kucoin',
			url: 'https://www.kucoin.com/trade/USDT-[TOKEN]'
		},
		{
			title: 'UniSwap',
			type: 'dex',
			logo: 'UniSwap',
			url: 'https://app.uniswap.org/swap?chain=mainnet&exactField=output&outputCurrency=[TOKEN_ADDRESS]&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7'
		}
	];

	let filteredSwaps = swaps;

	function applyTokenBuyParams() {
		swaps.forEach((swap) => {
			if (token.symbol) swap.url = swap.url.replace('[TOKEN]', token.symbol);
			if (token.contractAddress)
				swap.url = swap.url.replace('[TOKEN_ADDRESS]', token.contractAddress);
		});
		console.log(swaps);
	}

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		applyTokenBuyParams();
		loading = false;
	});

	function filterSwaps(query: string) {
		const lowercaseQuery = query.toLowerCase();
		filteredSwaps = swaps.filter((swap) => {
			const { title } = swap;
			return title.toLowerCase().includes(lowercaseQuery);
		});
	}
</script>

<div>
	<div id="token-container" class="primary-font-color">
		<div class="field-section" style="padding-bottom: 12px;">
			<div class="flex field-section" style="padding-left: 0">
				<div class="text-3xl field-section-title" style="font-size: 24px;">
					Buy ${token.symbol}
				</div>
				<img
					style="width: 19px; margin: 0px 0px 0px 7px;"
					alt="logo"
					src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/usd-coin-usdc-logo.svg"
				/>
			</div>
			<div
				class="flex mt-6"
				style="padding: 12px; border: 1px solid #353c5c; border-radius: 10px; color: #9ca3af"
			>
				<img
				style="margin-right: 21px; width: 22px; filter:invert(0.6)"
					alt="info"
					src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/icons/info.svg"
				/>
				Please ensure that platforms visited are set to the correct chain when making transactions.
			</div>
		</div>
		<div class="field-section">
			<div class="flex items-center search-input" style="margin-bottom: 12px">
				<div class="ml-4">
					<MagnifyingGlass />
				</div>
				<input
					class="tertiary-background-color"
					on:input={(event) => {
						if (timeout) clearTimeout(timeout);
						timeout = setTimeout(() => {
							// @ts-ignore
							searchString = event.target.value;
							filterSwaps(searchString);
						}, 300);
					}}
					bind:value={searchString}
					placeholder="Exchange name"
					id="search"
					type="text"
				/>
				{#if searchString}
					<button
						class="absolute w-4 h-4 bg-transparent border-0 right-4"
						on:click={(event) => {
							event.stopPropagation();
							searchString = '';
							filterSwaps(searchString);
						}}
					>
						<Close />
					</button>
				{/if}
			</div>
			{#each filteredSwaps as swap}
				<a
					style="margin-bottom: 18px"
					class="tertiary-background-color swap-card flex items-center justify-between border border-gray-700 rounded-lg p-6 text-[#3e4556] cursor-pointer transition duration-300 hover:border-gray-400 hover:text-[#3e4556]"
					href={swap.url}
					target="_blank"
				>
					<div style="display: flex; align-items: center" class="">
						<div style="padding-top: 9px">
							<Web3Logo web3LogoRef={swap.logo} />
							<div class="flex items-center justify-center" style="margin-top: 9px;">
								<div class="field-title" style="font-size: 24px; color: white;">{swap.title}</div>
								<div style="margin-left: 12px; margin-bottom: 12px;">
									{#if swap.type === 'dex'}
										<div
											class="flex h-[26px] items-center justify-center rounded-full border px-3 border-[#EB00FF] text-[#EB00FF]"
										>
											DEX
										</div>
									{/if}
									{#if swap.type === 'cex'}
										<div
											class="flex h-[26px] items-center justify-center rounded-full border px-3 border-[#FF9900] text-[#FF9900]"
										>
											CEX
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-center">
						<CardArrow />
					</div>
				</a>
			{/each}
		</div>
	</div>
	<Loader show={loading} />
</div>
