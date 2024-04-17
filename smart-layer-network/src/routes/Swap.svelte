<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import Web3Logo from '../components/Web3Logo.svelte';
	import Badge from '../components/Badge.svelte';

	let loading = true;
	let timeout: any;
	let searchString: string;

	const bridges = [
		{
			title: 'DragonSwap',
			logo: 'DragonSwap',
			url: 'https://dgswap.io/swap?inputCurrency=0x5C13E303a62Fc5DEdf5B52D66873f2E59fEdADC2&outputCurrency=0x06A210EAE2b07f9dC22cDb10c2C77cA99b3d8968&chain=klaytn'
		},
		{
			title: 'OKX',
			logo: 'OKX',
			url: 'https://www.okx.com/web3/dex-swap#inputChain=1&inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputChain=1&outputCurrency=0xDb82c0d91E057E05600C8F8dc836bEb41da6df14'
		},
		{
			title: 'UniSwap',
			logo: 'UniSwap',
			url: 'https://app.uniswap.org/swap?chain=mainnet&exactField=output&outputCurrency=0xDb82c0d91E057E05600C8F8dc836bEb41da6df14&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7'
		}
	];

	let filteredBridges = bridges;

	context.data.subscribe(async (value) => {
		loading = false;
	});

	function filterBridges(query: string) {
		const lowercaseQuery = query.toLowerCase();
		filteredBridges = bridges.filter((bridge) => {
			const { title } = bridge;
			return title.toLowerCase().includes(lowercaseQuery);
		});
	}
</script>

<div>
	<div id="token-container" style="color: white;">
		<div class="field-section">
			<div class="field-section-title neue-plak" style="font-size: 24px;">Swap $SLN</div>
		</div>
		<div class="field-section" style="padding-bottom: 0;">
			<div class="search-input">
				<div style="margin-left: 18px; margin-top: 4px;">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_2420_881)">
							<path
								d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
								fill="#969696"
							/>
							<path
								d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
								fill="#858585"
							/>
						</g>
						<defs>
							<clipPath id="clip0_2420_881">
								<rect width="24" height="24" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</div>
				<input
					class="medium"
					on:input={(event) => {
						if (timeout) clearTimeout(timeout);
						timeout = setTimeout(() => {
							// @ts-ignore
							searchString = event.target.value;
							filterBridges(searchString);
						}, 300);
					}}
					bind:value={searchString}
					placeholder="Swap name"
					id="search"
					type="text"
				/>
				{#if searchString}
					<button
						on:click={(event) => {
							searchString = '';
							filterBridges(searchString);
						}}
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
								fill="#969696"
							/>
							<path
								d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
								fill="#858585"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>
		<div class="field-section">
			{#each filteredBridges as bridge}
				<a class="swap-card flex-between" href={bridge.url} target="_blank">
					<div style="display: flex; align-items: center" class="">
						<div style="padding-top: 9px">
							<Web3Logo web3LogoRef={bridge.logo} />
							<div class="flex-center" style="margin-top: 9px;">
								<div class="field-title" style="font-size: 24px; color: white;">{bridge.title}</div>
								<div style="margin-left: 12px;">
									<Badge />
								</div>
							</div>
						</div>
					</div>
					<div class="flex-center">
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1.23077 0V2.46154H11.8031L0 14.2646L1.73538 16L13.5385 4.19692V14.7692H16V0H1.23077Z"
								fill="#DDDDDD"
							/>
							<path
								d="M1.23077 0V2.46154H11.8031L0 14.2646L1.73538 16L13.5385 4.19692V14.7692H16V0H1.23077Z"
								fill="#CECECE"
							/>
						</svg>
					</div>
				</a>
			{/each}
		</div>
	</div>
	<Loader show={loading} />
</div>
