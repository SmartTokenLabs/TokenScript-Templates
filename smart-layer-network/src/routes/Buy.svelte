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
	let filteredSwaps: any;

	// TODO make this dynamic with regards to the addresses used above.

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		// @ts-ignore
		filteredSwaps = swapList();
		loading = false;
	});

	function swapList() {
		const slnAddress = token.contractAddress;
		const chainId = token.chainId;
		return [
			{
				title: 'BitTrue',
				type: 'cex',
				logo: 'BitTrue',
				url: 'https://www.bitrue.com/trade/sln_usdt'
			},
			{
				title: 'CoinOne',
				type: 'cex',
				logo: 'CoinOne',
				url: 'https://coinone.co.kr/exchange/trade/sln/krw'
			},
			{
				title: 'Crypto.com',
				type: 'cex',
				logo: 'CryptoCOM',
				url: 'https://crypto.com/price/smart-layer-network'
			},
			{
				title: 'DragonSwap',
				type: 'dex',
				logo: 'DragonSwap',
				url: 'https://dgswap.io/swap?inputCurrency=%22%22&outputCurrency=0x06A210EAE2b07f9dC22cDb10c2C77cA99b3d8968&chain=klaytn'
			},
			{
				title: 'Gate.io',
				type: 'cex',
				logo: 'GateIO',
				url: 'https://www.gate.io/trade/SLN_USDT'
			},
			{
				title: 'OKX',
				type: 'cex',
				logo: 'OKX',
				url: `https://www.okx.com/web3/dex-swap#inputChain=${chainId}&inputCurrency=""&outputChain=1&outputCurrency=${slnAddress}`
			},
			{
				title: 'kucoin',
				type: 'cex',
				logo: 'Kucoin',
				url: 'https://www.kucoin.com/trade/SLN-USDT'
			},
			{
				title: 'UniSwap',
				type: 'dex',
				logo: 'UniSwap',
				url: `https://app.uniswap.org/swap?chain=${
					chainId === 1 ? 'mainnet' : 'polygon'
				}&exactField=output&outputCurrency=${slnAddress}&inputCurrency=%22%22`
			}
		];
	}

	function filterSwaps(query: string) {
		const lowercaseQuery = query.toLowerCase();
		filteredSwaps = swapList().filter((swap: any) => {
			const { title } = swap;
			return title.toLowerCase().includes(lowercaseQuery);
		});
	}
</script>

<div>
	<div id="token-container" style="color: white;">
		<div class="field-section" style="padding-bottom: 12px;">
			<div class="text-3xl field-section-title neue-plak" style="font-size: 24px;">Buy $SLN</div>
			<div
				class="flex mt-6"
				style="padding: 12px; border: 1px solid #353c5c; border-radius: 10px; color: rgb(56 56 56); font-size: 14px;"
			>
				<img
					style="margin-right: 21px; width: 22px;"
					alt="info"
					src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/icons/info.svg"
				/>
				Please ensure that the platforms visited are set to the correct chain when making transactions.
			</div>
		</div>
		<div class="field-section">
			<div class="flex items-center search-input" style="margin-bottom: 12px">
				<div class="ml-4">
					<MagnifyingGlass />
				</div>
				<input
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
					style="background: #1E233C; margin-bottom: 18px"
					class="flex items-center justify-between p-6 text-white transition duration-300 border border-gray-700 rounded-lg cursor-pointer swap-card hover:border-gray-400 hover:text-gray-400"
					href={swap.url}
					target="_blank"
				>
					<div style="display: flex; align-items: center" class="">
						<div style="padding-top: 9px;">
							<div style="width: 32px;">
								<Web3Logo web3LogoRef={swap.logo} />
							</div>
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
