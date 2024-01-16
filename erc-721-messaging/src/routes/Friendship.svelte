<script lang="ts">
	import context from '../lib/context';
	import { Token, ThreadItem, Invite, Friend, NftCardTypes } from '../lib/types';
	import { showLoader, notify } from '../lib/storage';
	import NftCard from '../components/NftCard.svelte';
	import { MessageClient } from '../lib/messageClient';

	export let activeTabValue = 1;
	export let friendsTabActive = true;
	let friendId = '';

	let selectedInvite = "-1";

	let invites: Invite[] = [];
	let ownInvites: Invite[] = [];
	let friends: Friend[] = [];

	let token: Token;

	let loading = false;
	let client: MessageClient;
	// let reloadTimer;

	context.data.subscribe(async (value) => {
		if (!value.token) return;

		token = value.token;
		showLoader.set(true);
		client = await context.getMessageClient();
		await loadInvites();
		await loadOwnInvites();
		showLoader.set(false);
		// reloadTimer = setInterval(() => loadThreads(), 60000);
	});

	async function loadOwnInvites(){
		try {
			ownInvites = await client.getOwnFriendInvites();
			friends = await client.getApprovedFriend();
		} catch (e: any) {
			$notify = {status: false, message: 'Message load failed: ' + e.message}
		}
	}

	async function inviteFriend(localFriendId: string = "") {

		localFriendId = localFriendId != "" ? localFriendId : friendId;
		if (localFriendId == "") {
			$notify = {status: false, message: "Please enter the NFT#ID and try again"}
			return;
		}
		showLoader.set(true);
		try {
			let t = web3.tokens.data.currentInstance;

			try {
				localFriendId = BigInt(localFriendId).toString();
			} catch (e) {
				throw new Error('Invalid token ID. Number or hex string allowed only');
			}
			if (!localFriendId || !t.tokenId) {
				throw new Error('TokenId missing');
			}
			const result = await client.postInviteFriend(localFriendId);
			console.log({ result });
			$notify = {status: true, message: result.message}
			friendId = '';
			await loadOwnInvites()
			await loadInvites()
		} catch (e) {
			$notify = {status: false, message: e.message}
		}
		showLoader.set(false);
	}

	const loadInvites = async () => {
		try {
			invites = await client.getFriendInvites();
		} catch (e) {
			$notify = {status: false, message: 'Invite send failed: ' + e.message}
		}
	};

	function inviteToNft(invite: Invite) {
		return {
			unread: 0,
			contract: token.contractAddress,
			chainId: token.chainId.toString(),
			wrongOwner: false,
			friendsSharedKey: '',
			yourSharedKey: '',
			tokenId: invite.sendingTokenId,
			owner: invite.sendingAddress
		} as ThreadItem;
	}

	function friendToNft(fiend: Friend) {
		return {
			unread: 0,
			contract: token.contractAddress,
			chainId: token.chainId.toString(),
			wrongOwner: false,
			friendsSharedKey: '',
			yourSharedKey: '',
			tokenId:
				fiend.sendingTokenId == token.tokenId ? fiend.receivingTokenId : fiend.sendingTokenId,
			owner: fiend.sendingTokenId == token.tokenId ? fiend.receivingAddress : fiend.sendingAddress
		} as ThreadItem;
	}

	async function inviteConfirmHandler(){
		activeTabValue = 2;
		await loadInvites();
	}

	async function friendsHandler(){
		activeTabValue = 1;
		await loadOwnInvites();
	}
</script>

<div class="iframe-wrap">

	<div class="friends-header">
		<h2>Friends</h2>
		<div>Accept and request friendship from other NFT owners</div>
	</div>

	<div class="tabs-wrap">
		<ul>
			<li class={activeTabValue === 1 ? 'active' : ''}>
				<div
					tabindex="0"
					role="button"
					on:click={friendsHandler}
					on:keypress={friendsHandler}
				>
					Get Friends
				</div>
			</li>
			<li class={activeTabValue === 2 ? 'active' : ''}>
				<div
					tabindex="0"
					role="button"
					on:click={inviteConfirmHandler}
					on:keypress={inviteConfirmHandler}
				>
					Confirm Friends {invites.length ? '(' + invites.length + ')' : ''}
				</div>
			</li>
		</ul>
		{#if activeTabValue == 1}
			<div class="tab-content-wrap">
				<div class="description">
					Enter Token ID to send Friend Request. Friendship required for chatting.
				</div>
				<div id="invite-friend">
					<input
						type="text"
						id="message-input"
						bind:value={friendId}
						disabled={loading}
						placeholder="Token ID"
					/>
					<div
						class="btn-gradient {(loading || !friendId.length) ? "" : "active" }"
						on:click={()=>{inviteFriend(friendId)}}
						disabled={loading || !friendId.length}
					>
						Send Request
					</div>
				</div>

				<div class="friends-tabs">
					<div
						class={friendsTabActive ? 'active' : ''}
						on:click={() => {
							friendsTabActive = true;
						}}
						on:keypress={() => {
							friendsTabActive = true;
						}}
					>
						Friends {friends.length ? '(' + friends.length + ')' : ''}
					</div>
					<div
						class={friendsTabActive ? '' : 'active'}
						on:click={() => {
							friendsTabActive = false;
						}}
						on:keypress={() => {
							friendsTabActive = false;
						}}
					>
						Pending {ownInvites.length ? '(' + ownInvites.length + ')' : ''}
					</div>
				</div>

				{#if friendsTabActive}
					{#if friends.length}
						{#each friends.map(friendToNft) as friend}
							<NftCard nft={friend} accountType={NftCardTypes.Friends}/>
						{/each}
					{:else}
						<div>No friends yet</div>
					{/if}
				{:else if ownInvites.length}
					{#each ownInvites.map(inviteToNft) as friend}
						<NftCard 
							accountType={NftCardTypes.Friends}
							nft={friend} 
							clickable={false} />
					{/each}
				{:else}
					<div>No unanswered Invites</div>
				{/if}
			</div>
		{:else}
			<div class="tab-content-wrap">
				{#if invites && invites.length}
					<h2>Confirm Friends Requests:</h2>
					<h4>
						Please click friends requests to confirm friendship if you want to chat with those NFT
						owners.
					</h4>
					{#each invites.map(inviteToNft) as invite}
						<NftCard
							nft={invite}
							accountType={NftCardTypes.Friends}
							selected={selectedInvite}
							on:click={() => {selectedInvite = invite.tokenId}}
						/>
					{/each}
				{:else}
					<div>You don't have pending incoming Friends Requests</div>
				{/if}

				<div class="accept btn-gradient 
					{selectedInvite=="-1" ? "disabled" : ""}" 
					on:click={() => {console.log({selectedInvite});selectedInvite != "-1" && inviteFriend(selectedInvite);}}
				>Accept Request</div>

			</div>
		{/if}
	</div>
	
</div>


<style lang="scss">
    .disabled {
        opacity: 0.5;
        pointer-events: none;;
    }
	h2 {
		font-weight: 700;
		font-size: 18px;
	}
	.friends-tabs {
		margin-top: 20px;
		margin-bottom: 10px;
		div {
			margin-right: 20px;
			color: #8b8b8b;
			font-size: 18px;
			font-weight: 500;
			float: left;
			cursor: pointer;
			&.active {
				color: #0b0b0b;
			}
		}
	}
	.btn-gradient {
		background: linear-gradient(234.79deg, #001aff 37.73%, #4f95ff 118.69%);
		padding: 10px;
		font-size: 18px;
		font-weight: 600;
		color: #fff;
		text-align: center;
		border-radius: 4px;
	}
	.accept {
		margin-top: auto;
		width: 100%;
		cursor: pointer;
		border-radius: 10px;
    	padding: 17px;
		&.disabled {
			pointer-events: none;
		}
	}
	.iframe-wrap {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 20px 0;
		
		.tabs-wrap {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
		}
	}
	.friends-header {
		text-align: center;
	}
	.tabs-wrap {
		position: relative;
		margin-top: 18px;
		ul {
			display: flex;
			flex-wrap: wrap;
			// padding-left: 0;
			// margin-bottom: 0;
			list-style: none;
			// border-bottom: 1px solid #dee2e6;
			background: #eee;
			padding: 8px;
			box-shadow: 0px 0px 2px 0px #00000080;
			border-radius: 4px;
			justify-content: space-between;
			li {
				color: #001aff;
				width: calc(50% - 4px);
				text-align: center;
				font-size: 18px;
				cursor: pointer;
				div {
					padding: 0.5rem 0.1rem;
				}

				&.active,
				&:hover {
					outline: none;
					// background-color: #001aff;
					border-radius: 4px;
					color: #fff;
                    background: linear-gradient(234.79deg, #001AFF 37.73%, #4F95FF 118.69%);
				}
			}
		}
	}
	.tab-content-wrap {
		// margin-bottom: 10px;
		// padding: 15px;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		.description {
			margin-top: 10px;
		}
	}

	#invite-friend {
		// display: flex;
		// justify-content: center;
		width: 100%;
		input {
			// border: 1px solid;
			// border-image-source: linear-gradient(0deg, #858585, #858585),
			// 	linear-gradient(0deg, #969696, #969696);
			margin-bottom: 10px;
			margin-top: 10px;
			width: 100%;
			padding: 16px 12px;
			border: 1px solid #858585;
			border-radius: 4px;
			font-size: 16px;
		}
		.btn-gradient {
			opacity: 0.6;
			margin-top: 12px;
			margin-bottom: 13px;
			padding: 17px 0;
			border-radius: 10px;
			&.active {
				opacity: 1;
				cursor: pointer;
			}
		}
	}
	#message-input {
		flex-grow: 1;
	}
</style>
