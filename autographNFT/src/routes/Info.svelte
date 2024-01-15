<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';

	let token;
	let loading = true;
	let apiData;
	let signatures = [{ x: String, walletAddr: String }];

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;

		try {
			const initialTokenDataReq = await fetch(
				`https://api.autographnft.io/offers/signed/${token.tokenId}?network=mainnet`
			);
			const initialTokenData = await initialTokenDataReq.json();
			const nft_token_id = initialTokenData.nft_token_id;

			const offerDataReq = await fetch(
				`https://api.autographnft.io/offers/0x000000000437b3CCE2530936156388Bff5578FC3/${nft_token_id}?network=mainnet`
			);
			const offerData = await offerDataReq.json();
			signatures = offerData.map((dataItem: any) => {
				return {
					x: dataItem.identifier,
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
					src="https://autographnft.io/images/logo.svg"
					width="325px"
					style="width: 200px; display: block;"
				/>
				<div style="color: white; text-align: right; width: 100%;">| INFO</div>
			</div>
			<div style="margin: 20px 0;">
				<img src={token.image_preview_url} style="width: 100%;" />
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
				<p style="font-size: 14px;">{token.name}</p>
				<p style="font-size: 20px; margin-top: 30px;">Description</p>
				<p style="font-size: 14px;">{token.description}</p>

				{#if token?.tokenInfo?.attributes?.length > 0}
					<p style="font-size: 20px; margin-top: 40px;">Attributes</p>
					{#each token?.tokenInfo?.attributes as trait}
						<div>
							<div
								style="border: 2px solid #7e16da; font-size: 14px; height: 20px; width: fit-content; padding: 10px 18px 27px 18px; border-radius: 30px;"
							>
								{trait.value}
							</div>
						</div>
					{/each}
				{/if}
				<p style="font-size: 20px; margin-top: 40px;">Signatures</p>
				<div>
					{#each signatures as signature}
						<div style="display: flex; justify-content: space-between; margin: 22px 0;">
							<div style="width: 30px; margin-right: 9px;">X:</div>
							<div style="text-wrap: wrap;">{signature.x}</div>
						</div>
						<div style="display: flex; justify-content: space-between; margin: 22px 0;">
							<div style="width: 30px; margin-right: 9px;">EtherScan:</div>
							<div style="text-wrap: wrap;">{signature.walletAddr}</div>
						</div>
					{/each}
				</div>
				<div style="height: 1px; width: 100%; background: white;" />
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
