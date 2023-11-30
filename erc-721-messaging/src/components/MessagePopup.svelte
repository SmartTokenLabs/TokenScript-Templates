<script lang="ts">
	import context from '../lib/context';
	import type { ThreadItem } from '../lib/types';
	import MessageBubble from './MessageBubble.svelte';
	import Loader from './Loader.svelte';
	import CryptoJS from 'crypto-js';
	import { hexToAscii } from '../lib/helpers';

	export let closed: () => void;
	export let friendId: string;
	export let secret: string;
	export let threadsList: ThreadItems;

	const thread: ThreadItem | undefined = threadsList.find(
		(thread: ThreadItem) => thread.tokenId == friendId
	);

	type ThreadItems = ThreadItem[];

	let client;
	let token;
	let messages = null;
	let newMessageText = '';
	let reloadTimer;
	let loading = true;
	let error = '';

	function tryToDecryptMessage(msg){
		if (!msg.encrypted) return msg;

		if (!secret){
			msg.messageDecoded = "Message Encoded and Missing Secret Key. Try to reload page."
		} else {
			const bytes  = CryptoJS.AES.decrypt(msg.message, hexToAscii(secret));
			msg.messageDecoded = bytes.toString(CryptoJS.enc.Utf8);
		}
		return msg;
	}

	async function sendMessage() {
		if (!thread) return;
		loading = true;

		try {
			const result = await client.sendMessage(
				secret ? CryptoJS.AES.encrypt(newMessageText, hexToAscii(secret)).toString() : newMessageText, 
				friendId, 
				!!secret
			);
			
			let t = web3.tokens.data.currentInstance;
			result.receivingTokenId = friendId
			result.sendingTokenId = t.tokenId

			messages = [...messages, tryToDecryptMessage(result)];
			thread.messages = messages;
			console.log(messages)
			newMessageText = '';
			scrollToBottom(true);
			// console.log('Message sent: ', result);
		} catch (e) {
			console.error(e);
			alert('Message send failed: ' + e.message);
		}

		loading = false;
	}

	async function loadMessages(reload = false) {
		if (!thread) return;
		// const thread = threadsList.find((thread: ThreadItem) => thread.tokenId == friendId);

		if (thread.messages && !reload) {
			messages = thread.messages;
			return;
		}
		messages = await client.getMessageHistory(friendId);
		messages = messages.map(tryToDecryptMessage)
		thread.messages = messages;
		thread.unread = 0;

		scrollToBottom(reload);
	}

	function scrollToBottom(smooth = false) {
		setTimeout(() => {
			let messageHistory = document.getElementById('message-history');
			smooth
				? messageHistory.scroll({ top: messageHistory.scrollHeight, behavior: 'smooth' })
				: (messageHistory.scrollTop = messageHistory.scrollHeight);
		}, 200);
	}

	context.data.subscribe(async (value) => {
		if (!value.token) return;

		token = value.token;
		client = await context.getMessageClient();
		error = '';
		loading = true;
		try {
			await loadMessages();
		} catch (e) {
			console.error(e);
			error = e.message;
			loading = false;
			return;
			// alert('Message load failed: ' + e.message);
		}

		loading = false;
		reloadTimer = setInterval(() => loadMessages(true), 10000);
	});

	function cleanupAndClose() {
		if (reloadTimer) clearInterval(reloadTimer);
		closed();
	}
</script>

<div id="message-popup">
	<div id="message-header">
		<div id="message-title">
			Chat with NFT#{friendId}
			{thread?.friendsSharedKey && thread?.yourSharedKey
				? '(Encrypted messaging)'
				: '(Not secure messaging)'}
		</div>
		<div id="message-close" on:click={() => cleanupAndClose()}>X</div>
	</div>
	<div id="message-history">
		{#if error}
			<h3>{error}</h3>
		{:else if messages}
			{#each messages as message}
				<MessageBubble {message} senderTokenId={token.tokenId} />
			{/each}
		{/if}
		<div class="loader-modal-local" style="display: {loading ? 'block' : 'none'}">
			<Loader show={loading} />
		</div>
	</div>
	{#if !error}
		<div id="send-message">
			<textarea id="message-input" bind:value={newMessageText} disabled={loading} />
			<button
				type="button"
				on:click={() => sendMessage()}
				disabled={loading || !newMessageText.length}>Send Message</button
			>
		</div>
	{/if}
</div>

<style lang="scss">
	#message-popup {
		position: fixed;
		display: flex;
		flex-direction: column;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #fff;
	}

	#message-header {
		display: flex;
		border-bottom: 1px solid black;
	}

	#message-title {
		flex-grow: 1;
		display: flex;
		align-items: center;
		padding: 10px;
	}

	#message-close {
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		font-weight: bold;
		cursor: pointer;
	}

	#message-history {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: 10px;
		overflow: auto;
	}

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
	.loader-modal-local {
		position: absolute;
		left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(2px);
	        overflow: hidden;
	}
</style>
