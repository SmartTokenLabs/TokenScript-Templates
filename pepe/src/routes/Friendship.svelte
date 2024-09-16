<script lang="ts">
	import context from '../lib/context';
	import { Token, ThreadItem, Invite, Friend, TokenCardTypes } from '../lib/types';
	import { showLoader, notify } from '../lib/storage';
	import TokenCard from '../components/TokenCard.svelte';
	import { MessageClient } from '../lib/messageClient';
	export let activeTabValue = 1;
	export let friendsTabActive = true;

	let friendAddress = '';
	let selectedInvite = "-1";
	let invites: Invite[] = [];
	let ownInvites: Invite[] = [];
	let friends: Friend[] = [];
	let token: Token;
	let loading = false;
	let client: MessageClient;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		showLoader.set(true);
		client = await context.getMessageClient();
		const loadInviteSuccess = await loadInvites();
		if(loadInviteSuccess) await loadOwnInvites();
		showLoader.set(false);
	});

	async function loadOwnInvites(){
		try {
			ownInvites = await client.getOwnFriendInvites();
			friends = await client.getApprovedFriend();
		} catch (e: any) {

			console.error('Error loading invites:', e.message);

			const nonTokenHolder = e.message?.includes('looks like you do not own this token') ? true : false;

			if(nonTokenHolder) {
				$notify = {status: false, message: 'You must own PEPE to use this service.'}
			} else {
				$notify = {status: false, message: 'Failed to load invites. Or signature request was rejected.'}
			}

			return false
		}
		return true
	}

	async function inviteFriend(localFriendAddress: string = "") {
		if (!localFriendAddress || localFriendAddress == "") {
			$notify = {status: false, message: "Please enter the Wallet Address and try again"}
			return;
		}
		showLoader.set(true);
		try {
			const result = await client.postInviteFriend(localFriendAddress);
			console.log({ result });
			friendAddress = ''
			const loadOwnInviteSuccess = await loadOwnInvites()
			if(loadOwnInviteSuccess) await loadInvites()
			$notify = {status: true, message: 'Invite sent'}
		} catch (e) {
			console.error(e);
			$notify = {status: false, message: 'Invite send failed'}
		}
		showLoader.set(false);
		selectedInvite = "-1";
	}

	const loadInvites = async () => {
		try {
			invites = await client.getFriendInvites();
		} catch (e:any) {

			console.error('Error loading invites:', e.message);

			const nonTokenHolder = e.message?.includes('looks like you do not own this token') ? true : false;

			if(nonTokenHolder) {
				$notify = {status: false, message: "Sorry, looks like you do not own this token. It can be a cache issue, please wait 10 min and try again."}
			} else {
				$notify = {status: false, message: 'Failed to load invites. Or signature request was rejected.'}
			}
			return false
		}
		return true
	};

	function inviteToTokenHolder(invite: Invite) {
		return {
			unread: 0,
			contract: token.contractAddress,
			chainId: token.chainId.toString(),
			wrongOwner: false,
			friendsSharedKey: '',
			yourSharedKey: '',
			owner: invite.sendingAddress
		} as ThreadItem;
	}

	function friendToTokenHolder(friend: Friend) {
		let displayAddr = '';
		if(token.ownerAddress.toLocaleLowerCase() == friend.receivingAddress.toLocaleLowerCase()) displayAddr = friend.sendingAddress;
		if(token.ownerAddress.toLocaleLowerCase() == friend.sendingAddress.toLocaleLowerCase()) displayAddr = friend.receivingAddress;
		return {
			unread: 0,
			contract: token.contractAddress,
			chainId: token.chainId.toString(),
			wrongOwner: false,
			friendsSharedKey: '',
			yourSharedKey: '',
			owner: displayAddr
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

	function isValidEthAddress(address:string) {
  		const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  		return ethAddressRegex.test(address);
	}

</script>

<div class="iframe-wrap" style="margin: 40px 0;">

	<div class="friends-header">
		<div style="display: flex; justify-content: space-evenly;">
			<img alt="pepe" style="border-radius: 100%; width: 20%;" src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/pepe-avatar.png">
			<img alt="pepe" style="border-radius: 100%; width: 20%;" src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/pepe-avatar.png">
			<img alt="pepe" style="border-radius: 100%; width: 20%;" src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/pepe-avatar.png">
		</div>
		<h2 style="margin: 24px 0 12px 0;">Frens</h2>
		<div>Accept and request frenship from other PEPE fam</div>
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
					Get Frens
				</div>
			</li>
			<li class={activeTabValue === 2 ? 'active' : ''}>
				<div
					tabindex="0"
					role="button"
					on:click={inviteConfirmHandler}
					on:keypress={inviteConfirmHandler}
				>
					Confirm {invites.length ? '(' + invites.length + ')' : ''}
				</div>
			</li>
		</ul>
		{#if activeTabValue == 1}
			<div class="tab-content-wrap">
				<div class="pt-8 pb-2">
					Enter Wallet Address to send request. Frenship required for chatting.
				</div>
				<div id="invite-friend">
					<input
						type="text"
						id="message-input"
						bind:value={friendAddress}
						disabled={loading}
						placeholder="Wallet Address"
					/>
					<button
						style="width: 130px; height: 40px; padding: 0; border: none; margin: 16px 0;"
						class="btn-gradient {(loading || !isValidEthAddress(friendAddress)) ? "" : "active" }"
						on:click={()=>{inviteFriend(friendAddress)}}
						disabled={loading || !isValidEthAddress(friendAddress)}
						type="button"
					>
						Send
					</button>
				</div>

				<div class="friends-tabs">
					<button
						class={friendsTabActive ? 'active' : ''}
						on:click={() => {
							friendsTabActive = true;
						}}
						on:keypress={() => {
							friendsTabActive = true;
						}}
					>
						Frens {friends.length ? '(' + friends.length + ')' : ''}
					</button>
					<button
						class={friendsTabActive ? '' : 'active'}
						on:click={() => {
							friendsTabActive = false;
						}}
						on:keypress={() => {
							friendsTabActive = false;
						}}
					>
						Pending {ownInvites.length ? '(' + ownInvites.length + ')' : ''}
					</button>
				</div>

				<div class="mb-[40px]">
					{#if friendsTabActive}
						{#if friends.length}
							{#each friends.map(friendToTokenHolder) as friend}
								<TokenCard tokenItem={friend} accountType={TokenCardTypes.Friends} selected={''}/>
							{/each}
						{:else}
							<div>No frens yet</div>
						{/if}
					{:else if ownInvites.length}
						{#each ownInvites.map(inviteToTokenHolder) as friend}
							<TokenCard 
								selected={''}
								accountType={TokenCardTypes.Friends}
								tokenItem={friend} 
								clickable={false} />
						{/each}
					{:else}
						<div>No unanswered Invites</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="tab-content-wrap">
				{#if invites && invites.length}
					<h2 class="mt-8">Confirm Frens</h2>
					<h4 class="mt-2 mb-4">
						Please click friends requests to confirm frenship if you want to chat with those Token
						owners.
					</h4>
					{#each invites.map(inviteToTokenHolder) as invite}
						<TokenCard
							tokenItem={invite}
							accountType={TokenCardTypes.Friends}
							selected={selectedInvite}
							on:click={() => {
								selectedInvite = invite.owner
							}}
						/>
					{/each}
				{:else}
					<div class="py-4">You don't have pending incoming Frens Requests</div>
				{/if}

				<button class="accept btn-gradient 
					{selectedInvite=="-1" ? "disabled" : ""}" 
					on:click={() => {console.log({selectedInvite});selectedInvite != "-1" && inviteFriend(selectedInvite);}}
					disabled={selectedInvite=="-1"}
				>Accept Request</button>

			</div>
		{/if}
	</div>
	
</div>


<style lang="scss">

	button {
		cursor: pointer;
	}

	.friends-tabs button {
		color: #2f651b;
    	border: 1px solid #2F651B;
    	border-radius: 8px;
    	background: white;
    	padding: 7px 20px;
    	margin: 10px 0;
	}
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
			color: #2F651B;
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
		background: #2F651B;
		padding: 10px;
		font-size: 18px;
		font-weight: 600;
		color: #fff;
		text-align: center;
		border-radius: 4px;
		border: none;
	}
	.accept {
		margin-top: auto;
		margin-bottom: 20px;
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
		padding: 0px 0;
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
			list-style: none;
			background: #2F651B;
			padding: 8px;
			box-shadow: 0px 0px 2px 0px #00000080;
			border-radius: 8px;
			justify-content: space-between;
			li {
				color: #fff;
				width: calc(50% - 4px);
				text-align: center;
				font-size: 18px;
				cursor: pointer;
				transition: all 0.1s;
				div {
					padding: 0.7rem 0.1rem;
				}

				&.active,
				&:hover {
					outline: none;
					border-radius: 4px;
					color: #2F651B;
                    background: #fff;
				}
			}
		}
	}
	.tab-content-wrap {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	#invite-friend {
		width: 100%;
		input {
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
		color: black;
	}
</style>

