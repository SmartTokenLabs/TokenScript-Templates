<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import {
		getTokenBoundClientInstance,
		setTokenBoundAccountIsActive,
		setChainIdName,
		setTokenBoundAccount,
		setTokenBoundCollectables,
		setTokenBoundAssets
	} from './../lib/utils';

	let token: any;
	let loading = true;
	let tokenBoundCollectables: any = [];
	let tokenBoundAssets: any = [];
	let tokenBoundChainIdName: undefined | string;
	let tokenBoundAccountIsActive: boolean | undefined;
	let tokenboundClient: any;
	let tokenBoundAccount: string;

	context.data.subscribe(async (value) => {
		if (!value.token) return;

		token = value.token;

		tokenBoundChainIdName = setChainIdName(token.chainId);

		// You can load other data before hiding the loader
		loading = false;

		tokenboundClient = getTokenBoundClientInstance(token.chainId);

		tokenBoundAccount = await setTokenBoundAccount(
			tokenboundClient,
			token.contractAddress,
			token.tokenId
		);

		tokenBoundAccountIsActive = await setTokenBoundAccountIsActive(
			tokenboundClient,
			tokenBoundAccount
		);

		if (tokenBoundChainIdName && tokenBoundAccountIsActive) {
			tokenBoundCollectables = await setTokenBoundCollectables(
				tokenBoundChainIdName,
				tokenBoundAccount
			);
			tokenBoundAssets = await setTokenBoundAssets(tokenBoundChainIdName, tokenBoundAccount);
		}
	});
</script>

<div>
	{#if token}
		<div
			class="card-wrapper"
			style=" font-family: 'helvetica'; padding: 20px; background: #fff;"
		>
			<div
				class="card-heading"
				style="display: flex; justify-content: space-between; align-items: center;"
			>
				<h1 style="color: #6E47F3;font-size: 18px;">Info</h1>
				<div
					style="background: black;font-weight:600;border-radius: 9px;font-size: 12px;padding: 12px;color: white;"
				>
					Token Bound NFT
				</div>
			</div>

			<div
				class="card-detail-wrapper"
				style="background: #fff; background-image: radial-gradient(#CDCDD1 1px, transparent 0); background-size: 40px 40px; background-position: -19px -19px; height: 340px; margin-top: 32px;"
			>
				<div class="key-token-details-wrapper" style="position: relative; top: 40px;">
					<div class="key-token-details" style="background: #fff; width: 180px;">
						<img
							style="height: 180px; width: 180px;border-radius: 14px;"
							src={token.image_preview_url}
							alt={token.description}
						/>
					</div>
					<div class="secondary-token-details-wrapper">
						<p
							class="token-name"
							style="font-size: 24px; font-weight: 600; margin: 12px 0; background: white; width: fit-content;"
						>
							{token.name}
						</p>
						<div
							class="token-account-details-wrapper"
							style="display: flex;align-items: center; background: white; width: fit-content;"
						>
							<div
								class="token-account-details"
								style="width: 94px; display: flex;align-items: center;"
							>
								<svg
									width="24px"
									height="100%"
									viewBox="0 0 100 100"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									xml:space="preserve"
									xmlns:serif="http://www.serif.com/"
									style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
								>
									<g transform="matrix(3.42498,0,0,3.42498,-121.249,-121.247)">
										<path
											d="M38.151,46.991L38.151,56.842C38.151,58.573 39.556,59.978 41.287,59.978C41.287,59.978 58.72,59.978 58.72,59.978C60.451,59.978 61.856,58.573 61.856,56.842C61.856,56.842 61.856,47.024 61.856,47.024C61.856,45.293 60.451,43.888 58.72,43.888C58.72,43.888 41.287,43.888 41.287,43.888C41.141,43.888 40.998,43.898 40.858,43.917C41.24,42.696 42.001,42.522 42.001,42.522C42.001,42.522 41.97,42.52 41.97,42.52C41.97,42.52 42.094,42.526 42.094,42.526C42.094,42.526 58.566,42.526 58.566,42.526C59.256,42.526 59.816,41.966 59.816,41.276C59.816,40.586 59.256,40.026 58.566,40.026L42.147,40.026C41.903,40.009 40.957,39.998 40.015,40.684C39.156,41.311 38.158,42.605 38.144,45.479C38.143,45.634 38.146,46.762 38.151,46.991ZM59.356,47.024L59.356,56.842C59.356,57.193 59.071,57.478 58.72,57.478L41.287,57.478C40.936,57.478 40.651,57.193 40.651,56.842C40.651,56.842 40.651,47.024 40.651,47.024C40.651,46.673 40.936,46.388 41.287,46.388L58.72,46.388C59.071,46.388 59.356,46.673 59.356,47.024ZM56.57,50.583C55.476,50.583 54.587,51.472 54.587,52.566C54.587,53.661 55.476,54.55 56.57,54.55C57.665,54.55 58.554,53.661 58.554,52.566C58.554,51.472 57.665,50.583 56.57,50.583Z"
											style="fill:rgb(131,131,135);"
										/>
									</g>
								</svg>
								<p
									class="token-account-title"
									style="font-size: 12px; padding: 0; color: #6D6D6D; margin: 0 7px;"
								>
									Account
								</p>
							</div>
							{#if tokenBoundAccount}
								<a
									class="token-account"
									href={'https://etherscan.io/address/' + tokenBoundAccount}
									target="_blank"
									style="border-radius: 18px; background: white;font-size:12px;color: #6E47F3;padding: 6px 12px; word-break: break-all;"
								>
									{tokenBoundAccount}
								</a>
							{/if}
							{#if !tokenBoundAccount}
								<div
									class="token-account-loading"
									style="border-radius: 18px; background: white;font-size:12px;color: #6E47F3;padding: 6px 12px; word-break: break-all;"
								>
									loading...
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="token-tertiary-details-wrapper">
				<h2 style="color: #6D6D6D; font-size: 14px; font-weight: 400;">Attributes</h2>

				<div
					class="token-traits"
					style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 40px;"
				>
					{#each token?.tokenInfo?.attributes as trait}
						<div
							style="background: #FAFAFA; width: calc(50% - 12px); color: #6E47F3;font-weight: 100;font-size: 12px;padding: 14px; margin-bottom: 12px;"
						>
							<p style="font-size: 14px; padding: 0; margin: 0; margin-bottom: 7px;">
								{trait.trait_type}
							</p>
							<p style="color: black; margin: 0;">{trait.value}</p>
						</div>
					{/each}
				</div>

				<div class="token-collectables" style="margin-bottom: 30px;">
					<h2 style="color: #6D6D6D; font-size: 14px; font-weight: 400;">
						Collectables 🖼
					</h2>
					{#if tokenBoundCollectables.length}
						<div class="scroll-container">
							<div
								style={`width: ${
									tokenBoundCollectables.length
										? tokenBoundCollectables.length * 100 + 'px'
										: 0
								} overflow: scroll; display: flex;`}
							>
								{#each tokenBoundCollectables as nft}
									<img
										style="border-radius: 12px; height: 80px; width: 90px; background: grey; margin: 10px;"
										src={nft.image}
										alt={nft.name}
									/>
								{/each}
							</div>
						</div>
					{/if}
					{#if !tokenBoundCollectables.length}
						<div>
							<p
								style="font-size: 12px; margin-top: 18px; padding: 0; color: #6D6D6D;"
							>
								No collectables found.
							</p>
						</div>
					{/if}
				</div>
				<div class="token-assets" style="margin-bottom: 30px;">
					<h2 style="color: #6D6D6D; font-size: 14px; font-weight: 400;">Assets 💰</h2>
					{#if tokenBoundAssets.length}
						<div
							class="token-assets-wrapper"
							style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 40px;"
						>
							{#each tokenBoundAssets as asset}
								<div
									class="token-asset"
									style="background: #FAFAFA; width: 100%; color: #6E47F3;f ont-weight: 100; font-size: 12px;padding: 14px; margin-bottom: 12px;"
								>
									<div>
										<p
											style="font-weight: 300; font-size: 14px; padding: 0; margin: 0; margin-bottom: 7px;"
										>
											{asset.title}
										</p>
										<p style="color: black; margin: 0; font-weight: 300;">
											{asset.balance / Math.pow(10, asset.data.decimals)}
										</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}
					{#if !tokenBoundAssets.length}
						<div>
							<p style="font-size: 12px; padding: 9px 14px; color: #6D6D6D;">
								No assets found.
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
