<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import Web3Logo from '../components/Web3Logo.svelte';

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
