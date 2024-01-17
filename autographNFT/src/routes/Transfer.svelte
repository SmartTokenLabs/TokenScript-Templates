<script lang="ts">
	import Loader from '../components/Loader.svelte';
	import context from '../lib/context';
	import { getPixelColor } from './../utils/index';

	let token: any;
	let loading = true;
	let collectionName: string;
	let receivingAccountAddress: string;
	let cardBackground: string | undefined;
	let imageFailedToLoad = false;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;

		init();

		// You can load other data before hiding the loader
		loading = false;
	});

	function setCollectionName() {
		if (token.name.includes('#')) {
			collectionName = token.name.substring(0, token.name.indexOf('#'));
		} else {
			collectionName = token.name;
		}
	}

	function init() {
		setCollectionName();
	}

	function setTransactionParams(event: Event) {
		// @ts-ignore
		receivingAccountAddress = event.target.value;
		// @ts-ignore
		// TODO:
		web3.action.setProps({
			sendingAccountAddress: token.ownerAddress,
			receivingAccountAddress,
			tokenId: token.tokenId
		});
	}

	function setPixelColor(event: Event) {
		cardBackground = getPixelColor(event);
	}

	function handleImageError() {
		imageFailedToLoad = true;
	}
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
				<div style="color: white; text-align: right; width: 100%;">| TRANSFER</div>
			</div>
			<div style="margin: 20px 0;">
				<img alt="nft" src={token.image_preview_url} style="width: 100%;" />
			</div>

			<div
				style="border-radius: 7px; width: 100%; display: flex; justify-content: space-between; flex-direction: column;"
			>
				<p style="font-size: 20px; margin-top: 30px; font-weight: 400;">Transfer NFT</p>
				<div style="margin-bottom: 18px; border-radius: 20px;font-weight: 300;">
					<p
						style="font-family: 'Source Code Pro', monospace; margin: 7px 0; font-weight: 400; font-size: 14px; margin: 14px 0"
					>
						Send To Account Address
					</p>
					<input
						minlength="42"
						maxlength="42"
						on:change={(event) => {
							setTransactionParams(event);
						}}
						id="recieving-account"
						style="font-family: 'Source Code Pro', monospace; height: 54px; padding: 0 14px; width: 100%; border-radius: 4px; border: 1px solid #B6B6BF; margin: 5px 0;"
						type="text"
					/>
				</div>

				<div style="height: 1px; width: 100%; background: white;" />

				<p style="font-size: 20px; margin-top: 30px; font-weight: 400;">Transfer Summary</p>

				<div style="display: flex; align-items: center; margin: 22px 0;">
					<div style="min-width: 60px;">Send</div>
					<div style="text-wrap: wrap; word-break: break-word; margin-right: 9px; font-size:14px">
						{token.name}
					</div>
				</div>
				<div style="display: flex; align-items: center; margin: 22px 0;">
					<div style="min-width: 60px;">From</div>
					<div style="text-wrap: wrap; word-break: break-word; margin-right: 9px; font-size:14px">
						{token.ownerAddress}
					</div>
				</div>
				<div style="display: flex; align-items: center; margin: 22px 0;">
					<div style="min-width: 60px;">To</div>
					<div style="text-wrap: wrap; word-break: break-word; margin-right: 9px; font-size:14px">
						{receivingAccountAddress}
					</div>
				</div>
				<div style="display: flex; align-items: center; margin: 22px 0;">
					<div style="min-width: 60px;">Chain</div>
					<div style="text-wrap: wrap; word-break: break-word; margin-right: 9px; font-size:14px">
						{token.chainId}
					</div>
				</div>
			</div>
			<Loader show={loading} />
		</div>
	{/if}
</div>
