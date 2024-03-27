<script lang="ts">

	import context from '../lib/context';
	import { showLoader } from '../lib/storage';


	import NftCard from '../components/NftCard.svelte';
	import MessagePopup from '../components/MessagePopup.svelte';
	import { ThreadItem, Token, NftCardTypes } from '../lib/types';

	import { signMessage } from '../lib/data';
	import { MESSAGING_GENERATOR, MESSAGING_PRIME } from '../lib/constants';
	import { DH } from '../lib/dh';
	import { hexStringToUint8 } from '../lib/helpers';
	

	let token: Token;
	let contract;

	let threadsList: ThreadItem[] = [] as ThreadItem[];
	let selectedFriendId: string = '';
	let reloadTimer;
	let client;

	let userSharedKey: string;
	let derivedPrivateKey: string;
	let secret: string;

	let adminChatNft:ThreadItem;

	const loadThreads = async () => {
		try {
			client = await context.getMessageClient();
			const adminUnread = await client.getBroadcastMessageCount();
			if (adminUnread && adminUnread.hasOwnProperty("count")){
				adminChatNft = {
					contract: token.contractAddress,
					unread: adminUnread.count,
					tokenUri: token.contractURI,
					owner: "Admin account",
					tokenId: "admin",
					wrongOwner: false,
					tokenIdName: token.contractName || "ERC721 Contract",
					friendsSharedKey: "", 
					yourSharedKey: ""
				}
			}

			adminChatNft.unread = adminUnread.count
			const res = await client.getNewMessages();

			const friendsList = await client.getApprovedFriend();

			// friendship requests can be initiated by both sides
			// extract friend data
			let list = friendsList.map((item) => {
				if (item.sendingTokenId != token.tokenId) {
					return {
						tokenId: item.sendingTokenId,
						owner: item.sendingAddress,
						friendsSharedKey: item.sendingSharedKey || '',
						yourSharedKey: item.receivingSharedKey || '',
						wrongOwner: false,
						unread: res.senders[item.sendingTokenId]?.unread ?? 0
					} as ThreadItem;
				} else {
					return {
						tokenId: item.receivingTokenId,
						owner: item.receivingAddress,
						friendsSharedKey: item.receivingSharedKey || '',
						yourSharedKey: item.sendingSharedKey || '',
						wrongOwner: false,
						unread: res.senders[item.receivingTokenId]?.unread ?? 0
					} as ThreadItem;
				}
			});

			threadsList = list.sort((a, b) => {
				return a.unread < b.unread ? 1 : -1;
			});

			threadsList = await Promise.all(
				threadsList.map(async (item) => {
					let owner = await contract['ownerOf'](item.tokenId);
					if (!owner || owner.toLowerCase() != item.owner.toLowerCase()) item.wrongOwner = true;

					return item;
				})
			);
		} catch (e) {
			console.error(e);
			alert('Message load failed: ' + e.message);
		}
		showLoader.set(false);
	};

	context.data.subscribe(async (value) => {
		if (!value.token) return;	
		token = value.token;
		contract = value.contract;
		$showLoader = true;
		await loadThreads();
		$showLoader = false;
		reloadTimer = setInterval(loadThreads, 60000);
	});
	context.messagingKey.subscribe((value) => {
		userSharedKey = value;
	});
	context.derivedPrivateKey.subscribe((value) => {
		derivedPrivateKey = value;
	});

	async function getDerivedKey() {
		if (derivedPrivateKey) {
			return;
		}

		let t = web3.tokens.data.currentInstance;
		const signature = await signMessage(
			`Sign this message to enable encryption of messages from [${t.contractAddress}#${t.tokenId}]`
		);
		const key = signature.substring(signature.length - 64);
		context.derivedPrivateKey.set(key);
	}

	async function friendSelected(friend: ThreadItem) {
		// @ts-ignore
		showLoader.set(true);
		try {
			if (!friend.yourSharedKey && !userSharedKey) {
				await getDerivedKey();

				const walletDH = new DH(
					// hexStringToUint8(import.meta.env.VITE_MESSAGING_PRIME),
					hexStringToUint8(MESSAGING_PRIME),
					// hexStringToUint8(import.meta.env.VITE_MESSAGING_GENERATOR)
					hexStringToUint8(MESSAGING_GENERATOR)
				);

				walletDH.setPrivateKey(hexStringToUint8(derivedPrivateKey));

				userSharedKey = walletDH.generateKeys();

				context.messagingKey.set(userSharedKey);

				await client.postSecureMessaging(userSharedKey);
				friend.yourSharedKey = userSharedKey;
			} else {
				if (friend.yourSharedKey) {
					context.messagingKey.set(friend.yourSharedKey);
				}
			}
			// @ts-ignore
			if (!friend.friendsSharedKey) {
				console.log('Friend have to sign and send to server');
			} else {
				await getDerivedKey();

				const walletDH = new DH(
					hexStringToUint8(MESSAGING_PRIME),
					hexStringToUint8(MESSAGING_GENERATOR)
				);

				walletDH.setPrivateKey(hexStringToUint8(derivedPrivateKey));

				secret = walletDH.computeSecret(hexStringToUint8(friend.friendsSharedKey));
				console.log('Secret = ', secret);
			}
		} catch (e) {
			console.log('....Shared key error....');
			console.log(e);
		}
		showLoader.set(false);

		friend.wrongOwner || (selectedFriendId = friend.tokenId);
	}

	function adminSelected(){
		selectedFriendId = "admin"
	}
</script>

<h3 class="text-center">Messages</h3>
<div class="text-center">Send messages to other NFT owners.</div>


<div id="thread-list">
	{#if adminChatNft}
	<NftCard nft={adminChatNft}  
		accountType={NftCardTypes.Admin}
		on:click={adminSelected}
		on:keypress={adminSelected}/>
	{/if}
	{#if threadsList}
		{#if threadsList.length}
			<div class="cat-list">
				{#each threadsList as friend}
					<NftCard nft={friend}
					accountType={NftCardTypes.Messages}
					on:click={() => {
						friendSelected(friend);
					}}
					on:keypress={() => {
						friendSelected(friend);
					}}/>
				{/each}
			</div>
		{:else if !$showLoader}
			<h5>You don't have any messages from your friends yet</h5>
			<p>
				Share your NFT ID with other owners or request some NFT to be your friend and when another
				NFT owner approve your friendship request then you can start chatting
			</p>
		{/if}
	{:else}
		<div>No message threads.</div>
	{/if}

	{#if selectedFriendId}
		<MessagePopup
			threadsList={selectedFriendId=="admin"?[adminChatNft]:threadsList}
			friendId={selectedFriendId}
			{secret}
			closed={() => {selectedFriendId = ''; loadThreads()}}
		/>
	{/if}
</div>

<style lang="scss">
	#thread-list {
		margin-top: 40px;
	}
	.cat-list {
		// margin: 0 10px;
		display: flex;
		flex-direction: column;
		cursor: pointer;
	}
	.text-center {
		text-align: center;
	}
</style>
