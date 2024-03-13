<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';

	let token;
	let loading = true;
	let signatures = [{ x: String, walletAddr: String }];

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;

		// supported chains (mainnet and matic)
		// @ts-ignore
		const network = token?.chainId === 1 ? 'mainnet' : 'matic';

		try {
			const initialTokenDataReq = await fetch(
				`https://api.autographnft.io/offers/signed/${token.tokenId}?network=${network}`
			);
			const initialTokenData = await initialTokenDataReq.json();
			const nft_token_id = initialTokenData.nft_token_id;

			let baseAddr =
				// @ts-ignore
				token?.contractAddress === '0x222222222291749de47895c0c0a9b17e4fca8268'
					? '0x000000000437b3CCE2530936156388Bff5578FC3'
					: // @ts-ignore
					  token?.contractAddress;

			const offerDataReq = await fetch(
				`https://api.autographnft.io/offers/${baseAddr}/${nft_token_id}?network=${network}`
			);
			const offerData = await offerDataReq.json();
			signatures = offerData.map((dataItem: any) => {
				return {
					x:
						'@' +
						dataItem.identifier.replace(/^(.*?)\s(.*)$/, '$1').replace('https://twitter.com/', ''),
					walletAddr: dataItem.identifier_wallet
				};
			});
		} catch (e) {
			console.log('could not find NFT data');
		}
	});
</script>

<div>
	{#if token}
		<div style="background: black; height: 100%; padding: 30px; color: #e7e7e7;">
			<div style="display: flex; justify-content: space-between; width: 100%;">
				<img
					alt="logo"
					src="https://autographnft.io/images/logo.svg"
					width="325px"
					style="width: 200px; display: block;"
				/>
				<div style="color: white; text-align: right; width: 100%;">| INFO</div>
			</div>
			<div style="margin: 20px 0;">
				<img alt="nft" src={token.image_preview_url} style="width: 100%;" />
			</div>
			<div>
				<p style="font-size: 20px; margin-top: 30px;">About the Collection</p>
				<p style="font-size: 14px;">
					Remixed Tokens, powered by AlchemyNFT. Backed 1:1 by their original NFT artworks, they are
					ERC721 tokens on the Ethereum network. These NFTs are autographed and signed with the
					author's Twitter account. Owned and controlled by their respective owners.
				</p>
				<p style="font-size: 20px; margin-top: 30px;">Official Website</p>
				<p style="font-size: 14px;">
					<a target="_blank" style="color:#7e16da" href="https://autographnft.io/"
						>https://autographnft.io/</a
					>
				</p>
				<p style="font-size: 20px; margin-top: 30px;">Token Name</p>
				<p style="font-size: 14px; word-break: break-word;">{token.name}</p>
				<p style="font-size: 20px; margin-top: 30px;">Description</p>
				<p style="font-size: 14px; word-break: break-word;">{token.description}</p>

				{#if token?.tokenInfo?.attributes?.length > 0}
					<p style="font-size: 20px; margin-top: 40px;">Attributes</p>
					{#each token?.tokenInfo?.attributes as trait}
						<div style="margin: 10px 0;">
							<div
								style="border: 2px solid #7e16da; font-size: 14px; width: fit-content; padding: 10px 18px; border-radius: 30px;"
							>
								{trait.trait_type}: {trait.value}
							</div>
						</div>
					{/each}
				{/if}
				{#if signatures.length}
					<p style="font-size: 20px; margin-top: 40px;">Signatures</p>
					<div>
						{#each signatures as signature}
							<div style="display: flex; align-items: center; margin: 22px 0;">
								<div style="min-width: 34px;">
									<svg
										viewBox="0 0 1200 1227"
										xmlns="http://www.w3.org/2000/svg"
										role="none"
										class="u01b__icon-home"
										style="fill: white; width: 16px; padding-top: 9px"
									>
										<path
											d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
										/>
									</svg>
								</div>
								<div
									style="text-wrap: wrap; word-break: break-word; margin-right: 9px; font-size:14px"
								>
									{signature.x}
									<a href={`https://twitter.com/${signature.x}`} target="_blank">
										<svg
											style="width: 18px; position: relative; top: 4px; left: 2px; fill:white;"
											width="100%"
											height="100%"
											viewBox="0 0 100 100"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											xmlns:xlink="http://www.w3.org/1999/xlink"
											xml:space="preserve"
										>
											<g transform="matrix(2.56187,0,0,2.56187,-3302.82,-4886.51)">
												<path
													d="M1308.92,1911.91L1308.92,1914.41L1300.89,1914.41C1297.78,1914.41 1295.26,1916.93 1295.26,1920.04C1295.26,1920.04 1295.26,1933.79 1295.26,1933.79C1295.26,1936.9 1297.78,1939.42 1300.89,1939.42C1300.89,1939.42 1316.59,1939.42 1316.59,1939.42C1319.7,1939.42 1322.22,1936.9 1322.22,1933.79L1322.22,1928.52L1324.72,1928.52L1324.72,1933.79C1324.72,1938.28 1321.08,1941.92 1316.59,1941.92L1300.89,1941.92C1296.4,1941.92 1292.76,1938.28 1292.76,1933.79L1292.76,1920.04C1292.76,1915.56 1296.4,1911.91 1300.89,1911.91L1308.92,1911.91ZM1324.52,1913.16L1323.27,1911.91L1313.75,1911.91L1313.75,1914.41L1320.26,1914.41L1308.04,1926.63L1309.8,1928.4L1322.04,1916.17C1322.04,1916.17 1322.07,1923.54 1322.07,1923.54L1324.57,1923.53L1324.52,1913.16Z"
												/>
											</g>
										</svg>
									</a>
								</div>
							</div>
							<div style="display: flex; align-items: center; margin: 22px 0;">
								<div style="min-width: 34px;">
									<img
										alt="etherscan logo"
										width="16px"
										style="border-radius: 30px; padding-top: 9px"
										src="https://avatars.githubusercontent.com/u/26205098?s=280&v=4"
									/>
								</div>
								<div
									style="text-wrap: wrap; word-break: break-word; margin-right: 9px; font-size:14px"
								>
									{signature.walletAddr}
									<a href={`https://etherscan.io/address/${signature.walletAddr}`} target="_blank">
										<svg
											style="width: 18px; position: relative; top: 4px; left: 2px; fill:white;"
											width="100%"
											height="100%"
											viewBox="0 0 100 100"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											xmlns:xlink="http://www.w3.org/1999/xlink"
											xml:space="preserve"
										>
											<g transform="matrix(2.56187,0,0,2.56187,-3302.82,-4886.51)">
												<path
													d="M1308.92,1911.91L1308.92,1914.41L1300.89,1914.41C1297.78,1914.41 1295.26,1916.93 1295.26,1920.04C1295.26,1920.04 1295.26,1933.79 1295.26,1933.79C1295.26,1936.9 1297.78,1939.42 1300.89,1939.42C1300.89,1939.42 1316.59,1939.42 1316.59,1939.42C1319.7,1939.42 1322.22,1936.9 1322.22,1933.79L1322.22,1928.52L1324.72,1928.52L1324.72,1933.79C1324.72,1938.28 1321.08,1941.92 1316.59,1941.92L1300.89,1941.92C1296.4,1941.92 1292.76,1938.28 1292.76,1933.79L1292.76,1920.04C1292.76,1915.56 1296.4,1911.91 1300.89,1911.91L1308.92,1911.91ZM1324.52,1913.16L1323.27,1911.91L1313.75,1911.91L1313.75,1914.41L1320.26,1914.41L1308.04,1926.63L1309.8,1928.4L1322.04,1916.17C1322.04,1916.17 1322.07,1923.54 1322.07,1923.54L1324.57,1923.53L1324.52,1913.16Z"
												/>
											</g>
										</svg>
									</a>
								</div>
							</div>
						{/each}
					</div>
					<div style="height: 1px; width: 100%; background: white;" />
				{/if}
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
