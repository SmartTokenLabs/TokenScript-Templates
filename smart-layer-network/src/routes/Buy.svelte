<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import Web3Logo from '../components/Web3Logo.svelte';
	import CardArrow from '../components/CardArrow.svelte';
	import MagnifyingGlass from '../components/MagnifyingGlass.svelte';
	import Close from '../components/Close.svelte';

	let loading = true;
	let timeout: any;
	let searchString: string;

	const swaps = [
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
			url: 'https://dgswap.io/swap?inputCurrency=0x5C13E303a62Fc5DEdf5B52D66873f2E59fEdADC2&outputCurrency=0x06A210EAE2b07f9dC22cDb10c2C77cA99b3d8968&chain=klaytn'
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
			url: 'https://www.okx.com/web3/dex-swap#inputChain=1&inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputChain=1&outputCurrency=0xDb82c0d91E057E05600C8F8dc836bEb41da6df14'
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
			url: 'https://app.uniswap.org/swap?chain=mainnet&exactField=output&outputCurrency=0xDb82c0d91E057E05600C8F8dc836bEb41da6df14&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7'
		}
	];

	let filteredSwaps = swaps;

	context.data.subscribe(async (value) => {
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
	<div id="token-container" style="color: white;">
		<div class="field-section">
			<div class="field-section-title neue-plak" style="font-size: 24px;">Buy $SLN</div>
		</div>
		<div class="field-section">
			<div class="search-input flex items-center" style="margin-bottom: 12px">
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
						class="w-4 h-4 border-0 bg-transparent absolute right-4"
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
					class="swap-card flex items-center justify-between border border-gray-700 rounded-lg p-6 text-white cursor-pointer transition duration-300 hover:border-gray-400 hover:text-gray-400"
					href={swap.url}
					target="_blank"
				>
					<div style="display: flex; align-items: center" class="">
						<div style="padding-top: 9px;">
							<div style="width: 32px;">
								<Web3Logo web3LogoRef={swap.logo} />
							</div>
							<div class="flex justify-center items-center" style="margin-top: 9px;">
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
					<div class="flex justify-center items-center">
						<CardArrow />
					</div>
				</a>
			{/each}
		</div>
	</div>
	<Loader show={loading} />
</div>
