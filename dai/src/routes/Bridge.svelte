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

	const bridges = [
		{
			title: 'Arbitrum',
			subTitle: 'Arbitrum One',
			logo: 'Arbitrum',
			url: 'https://bridge.arbitrum.io/'
		},
		{
			title: 'Base',
			subTitle: 'Base',
			logo: 'Base',
			url: 'https://bridge.base.org/'
		},
		{
			title: 'Linea',
			subTitle: 'Linea',
			logo: 'Linea',
			url: 'https://bridge.linea.build/'
		},
		{
			title: 'Optimism',
			subTitle: 'Optimism',
			logo: 'Optimism',
			url: 'https://app.optimism.io/bridge/deposit'
		},
		{
			title: 'Polygon',
			subTitle: 'Matic',
			logo: 'Polygon',
			url: 'https://portal.polygon.technology/bridge'
		},
		{
			title: 'Klaytn',
			subTitle: 'PortalBridge',
			logo: 'PortalBridge',
			url: 'https://portalbridge.com/advanced-tools/#/transfer?sourceChain=ethereum&targetChain=klaytn'
		},
		{
			title: 'Scroll',
			subTitle: 'Scroll',
			logo: 'Scroll',
			url: 'https://scroll.io/bridge'
		},
		{
			title: 'zkSync',
			subTitle: 'zkSync',
			logo: 'ZkSync',
			url: 'https://portal.zksync.io/bridge/'
		}
	];

	let filteredBridges = bridges;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		loading = false;
	});

	function filterBridges(query: string) {
		const lowercaseQuery = query.toLowerCase();
		filteredBridges = bridges.filter((bridge) => {
			const { title, subTitle } = bridge;
			return (
				title.toLowerCase().includes(lowercaseQuery) ||
				subTitle.toLowerCase().includes(lowercaseQuery)
			);
		});
	}
</script>

<div>
	<div id="token-container" class="primary-font-color">
		<div class="field-section" style="padding-bottom: 12px;">
			<div class="flex field-section" style="padding-left: 0">
				<div class="text-3xl field-section-title" style="font-size: 24px;">
					Bridge ${token.symbol}
				</div>
				<img
					style="width: 19px; margin: 0px 0px 0px 7px;"
					alt="logo"
					src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/dai-logo.svg"
				/>
			</div>
			<div
				class="flex mt-6"
				style="padding: 12px; border: 1px solid #353c5c; border-radius: 10px; color: rgb(56 56 56); font-size: 14px;"
			>
				<img
				style="margin-right: 21px; width: 22px; filter:invert(0.6)"
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
					class="tertiary-background-color"
					on:input={(event) => {
						if (timeout) clearTimeout(timeout);
						timeout = setTimeout(() => {
							// @ts-ignore
							searchString = event.target.value;
							filterBridges(searchString);
						}, 300);
					}}
					bind:value={searchString}
					placeholder="Bridge or Network name"
					id="search"
					type="text"
				/>
				{#if searchString}
					<button
						class="absolute w-4 h-4 bg-transparent border-0 right-4"
						on:click={(event) => {
							event.stopPropagation();
							searchString = '';
							filterBridges(searchString);
						}}
					>
						<Close />
					</button>
				{/if}
			</div>
			{#each filteredBridges as bridge}
				<a
					style="margin-bottom: 18px"
					class="tertiary-background-color swap-card flex items-center justify-between border border-gray-700 rounded-lg p-6 text-[#3e4556] cursor-pointer transition duration-300 hover:border-gray-400 hover:text-[#3e4556]"
					href={bridge.url}
					target="_blank"
				>
					<div class="flex items-center">
						<div style="padding-top: 9px">
							<Web3Logo web3LogoRef={bridge.logo} />
							<div style="margin-top: 9px;">
								<div class="text-3xl text-white field-title">{bridge.title}</div>
								<div class="field-title text-[#cecece] text-xl">{bridge.subTitle}</div>
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
