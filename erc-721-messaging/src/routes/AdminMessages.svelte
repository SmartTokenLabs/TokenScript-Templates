<script lang="ts">
	import context from '../lib/context';
	import { showLoader, notify } from '../lib/storage';
	import { Token } from '../lib/types';

	let newMessageText: string = '';
	let loading = false;

	let token: Token;
	let contract;

	let messages: {
		createdAt: string;
		id: number;
		message: string;
		openedAt: string;
	}[];

	context.data.subscribe(async (value) => {
		if (!value.token) return;

		token = value.token;
		contract = value.contract;
		showLoader.set(true);
		try {
			const client = await context.getMessageClient();
			messages = await client.getBroadcastMessages();
			$notify = {status: true, message: 'Messages checked.'}
		} catch (e) {
			$notify = {status: false, message: e.message}
		}
		showLoader.set(false);
	});

	async function sendMessage() {
		showLoader.set(true);
		try {
			const client = await context.getMessageClient();
			const result = await client.sendBroadcastMessage(newMessageText);
			newMessageText = '';
			$notify = {status: true, message: 'Sessage sent'}
		} catch (e) {
			$notify = {status: false, message: e.message}
		}
		showLoader.set(false);
	}
</script>

{#if !loading}
	{#if token && token.contractOwner == token.ownerAddress}
		<h3>Send Admin Message to all NFTs under that contract</h3>
		<div id="send-message">
			<textarea id="message-input" bind:value={newMessageText} disabled={loading} />
			<button
				type="button"
				on:click={() => sendMessage()}
				disabled={loading || !newMessageText.length}>Send Message</button
			>
		</div>
	{:else}
		<h2>Admin Messages</h2>
		<h4>Broadcast notifications will be here. Messages for every NFT under this contract</h4>
	{/if}
{/if}
{#if messages}
	<div class="msg-wrap">
		{#each messages as msg}
			<div class="msg {msg.openedAt ? 'opened' : ''}">{msg.message}</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	#send-message {
		display: flex;
		textarea {
			flex-grow: 1;
			margin: 4px;
			border-radius: 5px;
		}
		button {
			flex-grow: 1;
			margin: 4px 4px 4px 0;
			border-radius: 5px;
		}
	}
	.msg-wrap {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		.msg {
			margin: 5px;
			padding: 5px 20px;
			min-width: 100px;
			border-radius: 10px;
			text-align: right;
			background-color: #ccf;
			&.opened {
				background-color: #eee;
			}
		}
	}
</style>
