<script lang="ts">
	// @ts-ignore

	import context from '../lib/context';
	import {showLoader} from "../lib/storage";
	
	import NftIcon from '../components/NftIcon.svelte';
	import OwnerAddress from '../components/OwnerAddress.svelte';
	import MessagePopup from '../components/MessagePopup.svelte';
	import Loader from '../components/Loader.svelte';
	import { ThreadItem, Token } from '../lib/types';

	import {signMessage} from "../lib/data";
	import {MESSAGING_GENERATOR, MESSAGING_PRIME} from "../lib/constants";
	import { DH } from '../lib/dh'
    import {hexStringToUint8} from "../lib/helpers"

	let token: Token;
	let contract;

	let threadsList: ThreadItem[] = [] as ThreadItem[];
	let selectedFriendId: string = '';
	let reloadTimer;
	let client;

	let userSharedKey: string;
	let derivedPrivateKey: string;
	let secret: string;

	const loadThreads = async () => {
		showLoader.set(true)
		try {
			client = await context.getMessageClient();
			const res = await client.getNewMessages();

			const friendsList = await client.getApprovedFriend();

			// friendship requests can be initiated by both sides
			// extract friend data
			let list = friendsList.map((item) => {
				if (item.sendingTokenId != token.tokenId) {
					return {
						tokenId: item.sendingTokenId,
						owner: item.sendingAddress,
						friendsSharedKey: item.sendingSharedKey || "" ,
						yourSharedKey: item.receivingSharedKey || "",
						wrongOwner: false,
						unread: res.senders[item.sendingTokenId]?.unread ?? 0
					} as ThreadItem;
				} else {
					return {
						tokenId: item.receivingTokenId,
						owner: item.receivingAddress,
						friendsSharedKey: item.receivingSharedKey || "",
						yourSharedKey: item.sendingSharedKey || "",
						wrongOwner: false,
						unread: res.senders[item.receivingTokenId]?.unread ?? 0
					} as ThreadItem;
				}
			});

			threadsList = list.sort((a, b) => {
				return a.unread < b.unread ? 1 : -1;
			});

			threadsList = await Promise.all(threadsList.map(async item=>{
				let owner = await contract["ownerOf"](item.tokenId)
				if (!owner || owner.toLowerCase() != item.owner.toLowerCase() )
					item.wrongOwner = true;
				
				return item;
			}))
		} catch(e){
			console.error(e);
			alert('Message load failed: ' + e.message);
		}
		showLoader.set(false)
	};

	context.data.subscribe(async (value) => {
		if (!value.token) return;

		token = value.token;
		contract = value.contract;

		await loadThreads();

		reloadTimer = setInterval(loadThreads, 60000);
	});
	context.messagingKey.subscribe(value=>{
		userSharedKey = value;
	})
	context.derivedPrivateKey.subscribe(value=>{
		derivedPrivateKey = value;
	})

	async function getDerivedKey(){
		if (derivedPrivateKey) {
			return
		};

		let t = web3.tokens.data.currentInstance;
		const signature = await signMessage(`Sign this message to enable encryption of messages from [${t.contractAddress}#${t.tokenId}]`);
		const key = signature.substring(signature.length-64)
		context.derivedPrivateKey.set(key)
	}

	async function friendSelected(friend:ThreadItem){
		// @ts-ignore
		showLoader.set(true)
		try {
			if (!friend.yourSharedKey && !userSharedKey){
				await getDerivedKey()
				
				const walletDH = new DH(
					// hexStringToUint8(import.meta.env.VITE_MESSAGING_PRIME), 
					hexStringToUint8(MESSAGING_PRIME), 
					// hexStringToUint8(import.meta.env.VITE_MESSAGING_GENERATOR)
					hexStringToUint8(MESSAGING_GENERATOR)
				);

				walletDH.setPrivateKey(hexStringToUint8(derivedPrivateKey))

				userSharedKey = walletDH.generateKeys()

				context.messagingKey.set(userSharedKey)

				await client.postSecureMessaging(userSharedKey)
				friend.yourSharedKey = userSharedKey
			} else {
				if (friend.yourSharedKey){
					context.messagingKey.set(friend.yourSharedKey)
				}
			}
			// @ts-ignore
			if (!friend.friendsSharedKey){
				console.log("Friend have to sign and send to server")
			} else {
				await getDerivedKey()

				const walletDH = new DH(
					hexStringToUint8(MESSAGING_PRIME), 
					hexStringToUint8(MESSAGING_GENERATOR)
				);
				
				walletDH.setPrivateKey(hexStringToUint8(derivedPrivateKey))

				secret = walletDH.computeSecret(hexStringToUint8(friend.friendsSharedKey))
				console.log("Secret = ", secret )

			}
		} catch(e){
			console.log("....Shared key error....")
			console.log(e)
		}
		showLoader.set(false)

		friend.wrongOwner || (selectedFriendId = friend.tokenId)
	}
</script>

<h3>Messages</h3>
<div id="thread-list">
	{#if threadsList}
		{#if threadsList.length}
			<div class="cat-list">
				{#each threadsList as friend}
					<div
						role="button"
						tabindex="0"
						class="cat-list-item {friend.wrongOwner ? "failed" : ""} {friend.friendsSharedKey ? "encrypted" : "non_encrypted"}"
						on:click={() => {friendSelected(friend)}}
						on:keypress={() => {friendSelected(friend)}}
					>
						<NftIcon tokenId={friend.tokenId} />
						<div class="cat-list-info">
							<h4>NFT#{friend.tokenId} {friend.wrongOwner ? "(Owner changed)":""}</h4>
							<span style="position: absolute; right: 10px; top: 10px;">{friend.unread} Unread</span
							>
							<OwnerAddress address={friend.owner} />
						</div>
					</div>
				{/each}
			</div>
		{:else}
			{#if !$showLoader }
			<h5>You don't have any messages from your friends yet</h5>
			<p>
				Share your NFT ID with other owners or request some NFT to be your friend and when another NFT owner approve your friendship request then you can start chatting
			</p>
			{/if}
		{/if}
	{/if}
	
	{#if selectedFriendId}
		<MessagePopup
			{threadsList}
			friendId={selectedFriendId}
			secret={secret}
			closed={() => (selectedFriendId = '')}
		/>
	{/if}
</div>

<style lang="scss">

	.cat-list {
		margin: 0 10px;
		display: flex;
		flex-direction: column;
	}

	.cat-list-item {
		width: 100%;
		margin: 6px 0;
		display: flex;
		cursor: pointer;
		border: darkgray 1px solid;
		border-radius: 10px;
		overflow: hidden;
		height: 64px;
		position: relative;
		&.encrypted {
			background-color: lightgreen;
		}
		&.non_encrypted {
			background-color: pink;
		}
		&.failed {
			background: red;
		}
	}

	.cat-list-info {
		flex-grow: 1;
		text-align: left;
		padding: 10px 20px;
		overflow: hidden;
	}

	.cat-list-info h4 {
		margin-top: 0;
		margin-bottom: 5px;
	}
</style>
