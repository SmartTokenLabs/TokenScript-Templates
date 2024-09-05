<script lang="ts">
	import context from '../lib/context';
	import type { ThreadItem, Token } from '../lib/types';
	import MessageBubble from './MessageBubble.svelte';
	import Loader from './Loader.svelte';
	import CryptoJS from 'crypto-js';
	import { hexToAscii } from '../lib/helpers';

	export let closed: () => void;
	export let friendId: string;
	export let secret: string;
	export let threadsList: ThreadItems;

	let thread: ThreadItem | undefined = threadsList.find(
		(thread: ThreadItem) => thread.tokenId == friendId
	);
	if (friendId == "admin") {
		thread = threadsList[0]
	}

	type ThreadItems = ThreadItem[];

	let client;
	let token:Token;
	let messages = null;
	let newMessageText = '';
	let reloadTimer;
	let loading = true;
	let error = '';

	function tryToDecryptMessage(msg) {
		if (!msg.encrypted) return msg;

		if (!secret) {
			msg.messageDecoded = 'Message Encoded and Missing Secret Key. Try to reload page.';
		} else {
			const bytes = CryptoJS.AES.decrypt(msg.message, hexToAscii(secret));
			msg.messageDecoded = bytes.toString(CryptoJS.enc.Utf8);
		}
		return msg;
	}

	async function sendMessage() {
		try {
			if (friendId == "admin"){
				const result = await client.sendBroadcastMessage(newMessageText);
				let newMessage = {
					createdAt: new Date().toISOString(),
					sendingTokenId: "admin",
					message: newMessageText,
					read: false,
					encrypted: false
				}
				// TODO fix
				messages = [...messages, newMessage];
				thread.messages = messages;
			} else {
				if (!thread) return;
				loading = true;

				const result = await client.sendMessage(
					secret
						? CryptoJS.AES.encrypt(newMessageText, hexToAscii(secret)).toString()
						: newMessageText,
					friendId,
					!!secret
				);

				let t = web3.tokens.data.currentInstance;
				result.receivingTokenId = friendId;
				result.sendingTokenId = t.tokenId;

				messages = [...messages, tryToDecryptMessage(result)];
				thread.messages = messages;
				console.log(messages);
				newMessageText = '';
				scrollToBottom(true);
				// console.log('Message sent: ', result);
			}
			
		} catch (e) {
			console.error(e);
			alert('Message send failed: ' + e.message);
		}

		loading = false;
	}

	async function loadMessages(reload = false) {
		

		if (friendId == "admin"){
			messages = await client.getBroadcastMessages();
		} else {

			if (!thread) return;
			// const thread = threadsList.find((thread: ThreadItem) => thread.tokenId == friendId);

			if (thread.messages && !reload) {
				messages = thread.messages;
				console.log("received messages from thread.messages, no reload...")
				return;
			}

			messages = await client.getMessageHistory(friendId);
			messages = messages.map(tryToDecryptMessage);
		}
		console.log("received messages:")
		console.log(messages)
		
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
		reloadTimer = setInterval(() => loadMessages(true), 30000);
	});

	function cleanupAndClose() {
		if (reloadTimer) clearInterval(reloadTimer);
		closed();
	}
</script>

<div id="message-popup">
	<div id="message-header">
		<div id="message-close" on:click={() => cleanupAndClose()}><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8.69745 12.6992L3.35412 7.34424L8.69745 1.98924L7.05245 0.344238L0.0524489 7.34424L7.05245 14.3442L8.69745 12.6992Z" fill="#0B0B0B"/>
			</svg>
			</div>
		<div id="message-title" title="{thread?.friendsSharedKey && thread?.yourSharedKey
			? '(Encrypted messaging)'
			: '(Not secure messaging)'}">
			{#if friendId=="admin"}
				{ thread?.tokenIdName}
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3111 6.68316C14.1055 7.21165 14.1055 7.798 14.3111 8.32649L14.4316 8.67357C14.8704 9.81959 14.339 11.1088 13.22 11.6132L12.9011 11.7548C12.3781 11.9802 11.955 12.388 11.7107 12.9023L11.569 13.2211C11.0645 14.3397 9.77485 14.871 8.62847 14.4323L8.30253 14.3119C7.77386 14.1063 7.18733 14.1063 6.65866 14.3119L6.33272 14.4323C5.18634 14.871 3.89667 14.3397 3.39219 13.2211L3.25048 12.9023C3.02507 12.3795 2.61706 11.9565 2.1026 11.7123L1.78375 11.5707C0.664719 11.0663 0.133314 9.77709 0.572109 8.63107L0.692564 8.30524C0.898191 7.77675 0.898191 7.1904 0.692564 6.66191L0.572109 6.33607C0.133314 5.19006 0.664719 3.90081 1.78375 3.39649L2.1026 3.25482C2.60967 3.02111 3.01669 2.61422 3.25048 2.10732L3.41344 1.78857C3.91849 0.658674 5.22282 0.125256 6.37524 0.577324L6.70118 0.697741C7.22984 0.903301 7.81638 0.903301 8.34504 0.697741L8.67098 0.577324C9.81736 0.138672 11.107 0.669904 11.6115 1.78857L11.7532 2.10732C11.987 2.61422 12.394 3.02111 12.9011 3.25482L13.22 3.41774C14.339 3.92206 14.8704 5.21131 14.4316 6.35732L14.3111 6.68316ZM6.60336 9.87769L10.5855 5.89686C10.716 5.76004 10.716 5.54492 10.5855 5.40811L10.2099 5.03269C10.0722 4.8977 9.85172 4.8977 9.71395 5.03269L6.35537 8.39019L5.29252 7.33477C5.22823 7.26629 5.13847 7.22745 5.04453 7.22745C4.95058 7.22745 4.86082 7.26629 4.79653 7.33477L4.42099 7.71019C4.35392 7.77669 4.3162 7.86722 4.3162 7.96165C4.3162 8.05608 4.35392 8.14661 4.42099 8.21311L6.10737 9.87769C6.17166 9.94617 6.26142 9.98502 6.35537 9.98502C6.44931 9.98502 6.53907 9.94617 6.60336 9.87769Z" fill="#2082E2"/>
                    </svg>
                
			{:else}
				NFT#{friendId}
			{/if}
		</div>
		
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
	{#if !error && (friendId!="admin" || token.contractOwner?.toLowerCase() == token.ownerAddress.toLowerCase())}
		<div id="send-message">
			<div class="input-wrapper">
				<textarea id="message-input" bind:value={newMessageText} disabled={loading} />
			</div>
			<div class="btn_send"
				on:click={sendMessage}
				on:keypress={sendMessage}
				disabled={loading || !newMessageText.length}>&gt;</div
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
		border-bottom: 1px solid #EEEEEE;
		background: linear-gradient(0deg, #FAFAFA, #FAFAFA),
			linear-gradient(0deg, #EEEEEE, #EEEEEE);
	}

	#message-title {
		flex-grow: 1;
		display: flex;
		align-items: center;
		padding: 10px;
		display: flex;
		align-items: center;
		svg {
			margin-left: 10px;
		}
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
		.input-wrapper {
			flex-grow: 1;
			margin: 4px;
			border-radius: 4px;
			background-image: linear-gradient(234.79deg, #001AFF 37.73%, #4F95FF 118.69%);
			padding: 2px;
			textarea {
				width: 100%;
				border-radius: 4px;
				display: block;
    			min-height: 46px;
				max-height: 150px;
				font-size: 16px;
				padding: 12px;
				box-sizing: border-box;
				height: 46px;
			}
		}
		
		.btn_send {
			flex-grow: 0;
			width: 50px;
			height: 50px;
			margin: 4px 4px 4px 0;
			border-radius: 4px;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background: linear-gradient(234.79deg, #001AFF 37.73%, #4F95FF 118.69%);
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
