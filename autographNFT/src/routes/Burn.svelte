<script lang="ts">
	import Loader from '../components/Loader.svelte';
	import context from '../lib/context';

	let token: any;
	let loading = true;
	let collectionName: string;
	let receivingAccountAddress: string;

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
		web3.action.setProps({
			sendingAccountAddress: token.ownerAddress,
			receivingAccountAddress,
			tokenId: token.tokenId
		});
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
				<div style="color: white; text-align: right; width: 100%;">| BURN</div>
			</div>

			<div
				style="margin: 22px 0; background-color: #ff3434; color: black; font-weight: 300;padding: 18px;"
			>
				<p style="margin: 7px 0;font-weight: 500;font-size: 14px;">WARNING:</p>

				<p style="font-weight: 400;font-size: 14px;">
					This is a destructive action which cannot be reversed. Continuing will remove this token
					from your wallet and the collection.
				</p>
			</div>

			<div style="margin: 20px 0;">
				<img alt="nft" src={token.image_preview_url} style="width: 100%;" />
			</div>

			<div
				style="border-radius: 7px; width: 100%; display: flex; justify-content: space-between; flex-direction: column;"
			>
				<div style="height: 1px; width: 100%; background: white;" />

				<p style="font-size: 20px; margin-top: 30px; font-weight: 400;">Burn Summary</p>

				<div style="display: flex; align-items: center; margin: 22px 0;">
					<div style="min-width: 60px;">Burn</div>
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
