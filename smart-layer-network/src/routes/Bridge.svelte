<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import Web3Logo from '../components/Web3Logo.svelte';
	import CardArrow from '../components/CardArrow.svelte';
	import MagnifyingGlass from '../components/MagnifyingGlass.svelte';

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
			title: 'PortalBridge',
			subTitle: 'PortalBridge',
			logo: 'PortalBridge',
			url: 'https://portalbridge.com/'
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
	<div id="token-container" style="color: white;">
		<div class="field-section">
			<div class="field-section-title neue-plak" style="font-size: 24px;">Bridge $SLN</div>
		</div>
		<div class="field-section" style="padding-bottom: 0;">
			<div class="search-input">
				<div style="margin-left: 18px; margin-top: 4px;">
					<MagnifyingGlass />
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
					placeholder="Bridge or Network name"
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
							<div style="margin-top: 9px;">
								<div class="field-title" style="font-size: 24px; color: white;">{bridge.title}</div>
								<div class="field-title" style="font-size: 18px;">{bridge.subTitle}</div>
							</div>
						</div>
					</div>
					<div class="flex-center">
						<CardArrow />
					</div>
				</a>
			{/each}
		</div>
	</div>
	<Loader show={loading} />
</div>
