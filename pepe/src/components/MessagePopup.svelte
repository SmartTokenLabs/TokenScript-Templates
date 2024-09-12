<script lang="ts">
  	import { onMount } from 'svelte'; 
	import context from '../lib/context';
	import type { ThreadItem, Token } from '../lib/types';
	import MessageBubble from './MessageBubble.svelte';
	import Loader from './Loader.svelte';
	import CryptoJS from 'crypto-js';
	import { hexToAscii } from '../lib/helpers';
	import { notify } from '../lib/storage';
	export let closed: () => void;
	export let selectedFriendAddress: string;
	export let secret: string;
	export let threadsList: ThreadItems;

	let thread: ThreadItem | undefined = threadsList.find(
		(thread: ThreadItem) => thread.friendAddress == selectedFriendAddress
	);

	if (selectedFriendAddress == "group") {
		thread = threadsList[0]
	}

	type ThreadItems = ThreadItem[];

	let client;
	let token:Token;
	let messages: any[] | null | undefined = null;
	let newMessageText = '';
	let reloadTimer;
	let loading = true;
	let error = '';
	let messageItemUIPositionArr:string[] = [];
	let newMessagesFound:boolean = false;

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
			if (selectedFriendAddress == "group"){
				await client.sendBroadcastMessage(newMessageText);
				let newMessage = {
					createdAt: new Date().toISOString(),
					maskedSendingTokenAddress: "loading...",
					message: newMessageText,
					balance: token?._count,
					read: true,
					encrypted: false
				}
				messages = [...messages, newMessage];
				thread.messages = messages;
				newMessageText = '';
				scrollToBottom(true);
				client.getBroadcastMessageCount(); // ensure that message count is updated
			} else {
				
				if (!thread) return;
				loading = true;
				const result = await client.sendMessage(
					secret
						? CryptoJS.AES.encrypt(newMessageText, hexToAscii(secret)).toString()
						: newMessageText,
						selectedFriendAddress,
					!!secret
				);
				let t = web3.tokens.data.currentInstance;
				result.receivingAddress = selectedFriendAddress;
				result.sendingTokenAddress = token.ownerAddress;
				messages = [...messages, tryToDecryptMessage(result)];
				thread.messages = messages;
				newMessageText = '';
				scrollToBottom(true);
				console.log('messages updated:', messages);
			}
			
		} catch (e) {
			console.error(e);
			$notify = {status: false, message: 'Message send failed: '}
		}

		loading = false;
		
	}

	async function loadMessages(reload = false) {
		const prevMessageLength = messages?.length;
		if (selectedFriendAddress == "group"){
			messages = await client.getBroadcastMessages();
			messageItemUIPositionArr = [];
			// set messaging position left/right
			messages?.map((message, index, messages) => {
				if (index === 0) {
					messageItemUIPositionArr.push('left');
				} else if (index > 0) {
					if (message.maskedSendingTokenAddress?.toLocaleLowerCase() === messages[index - 1].maskedSendingTokenAddress?.toLocaleLowerCase()) {
						messageItemUIPositionArr.push(messageItemUIPositionArr[messageItemUIPositionArr.length -1]);
					} else {
						messageItemUIPositionArr.push(messageItemUIPositionArr[messageItemUIPositionArr.length -1] === 'left' ? 'right' : 'left');
					}
				}
				return message;
			});
		} else {
			if (!thread) return;
			if (thread.messages && !reload) {
				messages = thread.messages;
				console.log("received messages from thread.messages, no reload...")
				return;
			}
			messages = await client.getMessageHistory(selectedFriendAddress);
			messages = messages.map(tryToDecryptMessage);
			messageItemUIPositionArr = [];
			messages?.map((message, index, messages) => {
				if (index === 0 && message.sendingTokenAddress) {
					if(message.sendingTokenAddress?.toLocaleLowerCase() === token.ownerAddress?.toLocaleLowerCase()){
						messageItemUIPositionArr.push('right'); // matching logic how p2p message UI is displayed.
					} else {
						messageItemUIPositionArr.push('left');
					}
				} else if (index > 0) {
					const connectedWalletIsSender = token.ownerAddress?.toLocaleLowerCase() === messages[index].sendingTokenAddress?.toLocaleLowerCase()
					const lastMessageWasFromSender = messages[index - 1].sendingTokenAddress?.toLocaleLowerCase() === token.ownerAddress?.toLocaleLowerCase();
					if (connectedWalletIsSender && lastMessageWasFromSender) {
						messageItemUIPositionArr.push(messageItemUIPositionArr[messageItemUIPositionArr.length -1]);
					} else {
						messageItemUIPositionArr.push(messageItemUIPositionArr[messageItemUIPositionArr.length -1] === 'left' ? 'right' : 'left');
					}
				}
				return message;
			});
		}
		thread.messages = messages;
		thread.unread = 0;

		if(prevMessageLength && messages && messages.length !== prevMessageLength) {
			newMessagesFound = true;
			buttonOpacity = 1;
		}
	}

	function scrollToBottom(smooth = false) {
		setTimeout(() => {
			let messageHistory = document.getElementById('message-history');
			smooth
				? messageHistory.scroll({ top: messageHistory.scrollHeight, behavior: 'smooth' })
				: (messageHistory.scrollTop = messageHistory.scrollHeight);

			newMessagesFound = false; // Reset new messages found
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
			scrollToBottom(false);
		} catch (e) {
			console.error(e);
			error = e.message;
			loading = false;
			throw new Error('Error loading messages');
		}

		loading = false;
		reloadTimer = setInterval(() => loadMessages(true), 7000);
	});

	function cleanupAndClose() {
		if (reloadTimer) clearInterval(reloadTimer);
		closed();
	}

	let buttonOpacity = 1; // Initial opacity for the button

    function handleScroll() {
        const messageHistory = document.getElementById('message-history');
        if (!messageHistory) return;
        
        const scrollTop = messageHistory.scrollTop;
        const scrollHeight = messageHistory.scrollHeight;
        const clientHeight = messageHistory.clientHeight;
        
		const offset = 50; // Offset from the bottom (to cater for any slight differences)
        // If scrolled to the bottom, reduce opacity
        if (scrollTop + clientHeight >= scrollHeight - offset) {
            buttonOpacity = 0.7;
        } else {
            buttonOpacity = 1;
        }
    }

	onMount(() => {
        const messageHistory = document.getElementById('message-history');
        if (messageHistory) {
            messageHistory.addEventListener('scroll', handleScroll);
        }

        // Clean up the event listener on component destroy
        return () => {
            if (messageHistory) {
                messageHistory.removeEventListener('scroll', handleScroll);
            }
        };
    });
</script>

<div id="message-popup">
	<div id="message-header">
		<button id="message-close" on:click={() => cleanupAndClose()}><svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8.69745 12.6992L3.35412 7.34424L8.69745 1.98924L7.05245 0.344238L0.0524489 7.34424L7.05245 14.3442L8.69745 12.6992Z" fill="#0B0B0B"/>
			</svg>
		</button>
		<div id="message-title" style="color: #258900; border: 1px solid #258900" title="{thread?.friendsSharedKey && thread?.yourSharedKey
			? '(Encrypted messaging)'
			: '(Not secure messaging)'}">
			{#if selectedFriendAddress=="group"}
				PEPE Group Chat
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3111 6.68316C14.1055 7.21165 14.1055 7.798 14.3111 8.32649L14.4316 8.67357C14.8704 9.81959 14.339 11.1088 13.22 11.6132L12.9011 11.7548C12.3781 11.9802 11.955 12.388 11.7107 12.9023L11.569 13.2211C11.0645 14.3397 9.77485 14.871 8.62847 14.4323L8.30253 14.3119C7.77386 14.1063 7.18733 14.1063 6.65866 14.3119L6.33272 14.4323C5.18634 14.871 3.89667 14.3397 3.39219 13.2211L3.25048 12.9023C3.02507 12.3795 2.61706 11.9565 2.1026 11.7123L1.78375 11.5707C0.664719 11.0663 0.133314 9.77709 0.572109 8.63107L0.692564 8.30524C0.898191 7.77675 0.898191 7.1904 0.692564 6.66191L0.572109 6.33607C0.133314 5.19006 0.664719 3.90081 1.78375 3.39649L2.1026 3.25482C2.60967 3.02111 3.01669 2.61422 3.25048 2.10732L3.41344 1.78857C3.91849 0.658674 5.22282 0.125256 6.37524 0.577324L6.70118 0.697741C7.22984 0.903301 7.81638 0.903301 8.34504 0.697741L8.67098 0.577324C9.81736 0.138672 11.107 0.669904 11.6115 1.78857L11.7532 2.10732C11.987 2.61422 12.394 3.02111 12.9011 3.25482L13.22 3.41774C14.339 3.92206 14.8704 5.21131 14.4316 6.35732L14.3111 6.68316ZM6.60336 9.87769L10.5855 5.89686C10.716 5.76004 10.716 5.54492 10.5855 5.40811L10.2099 5.03269C10.0722 4.8977 9.85172 4.8977 9.71395 5.03269L6.35537 8.39019L5.29252 7.33477C5.22823 7.26629 5.13847 7.22745 5.04453 7.22745C4.95058 7.22745 4.86082 7.26629 4.79653 7.33477L4.42099 7.71019C4.35392 7.77669 4.3162 7.86722 4.3162 7.96165C4.3162 8.05608 4.35392 8.14661 4.42099 8.21311L6.10737 9.87769C6.17166 9.94617 6.26142 9.98502 6.35537 9.98502C6.44931 9.98502 6.53907 9.94617 6.60336 9.87769Z" fill="#2082E2"/>
                    </svg>
			{:else}
			<div class="eth-address">
				{selectedFriendAddress}
				</div>
			{/if}
		</div>
		
	</div>
	<div id="message-history">
		{#if error}
		  <h3>{error}</h3>
		{:else if messages}
		  {#each messages as message, index}
			<MessageBubble 
			  message={message} 
			  position={messageItemUIPositionArr[index] ?? 'left'}
			  ownerAddress={token.ownerAddress} 
			  tokenDecimals={token?.decimals} 
			/>
		  {/each}
		{/if}
		<div class="loader-modal-local" style="display: {loading ? 'block' : 'none'}">
		  <Loader show={loading} />
		</div>
	  </div>
	<div id="send-message" class="mx-[10px] mb-[10px] h-[300px]">
		<div class="w-full text-right"><button on:click={() => scrollToBottom(true)}
			style="opacity: {buttonOpacity}; transition: opacity 0.3s;"
			class="h-[40px] bg-[#2f651c] px-[20px] text-[14px] rounded-md my-[10px] text-white">Jump to latest { newMessagesFound ? `(New Message(s))` : '' } <span class="text-[11px]">▼</span></button></div>
		<div class="flex">
			<div class="input-wrapper mr-[12px] h-[50px]">
				<textarea placeholder="Messsage" class="h-[50px] m-0" bind:value={newMessageText} disabled={loading} />
			</div>
			<button class="btn_send tertiary-background-color h-[50px]"
				on:click={sendMessage}
				on:keypress={sendMessage}
				disabled={loading || !newMessageText.length}>&gt;</button>
		</div>
	</div>
</div>

<style lang="scss">
	.eth-address {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 100%;
		display: block;
		font-size: 14px;
	}
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
		justify-content: space-between;
		margin: 10px;
	}

	#message-title {
		width: calc(100% - 50px);
		padding: 10px;
		display: flex;
		align-items: center;
		color: #fff;
		border-radius: 11px;
		text-overflow: ellipsis;
		svg {
			margin-left: 10px;
		}
	}

	#message-close {
		min-width: 50px;
		min-height: 50px;
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		font-weight: 700;
		cursor: pointer;
		background: black;
		border-radius: 8px;
		border: none;
		margin-right: 10px;
		svg {
			filter: invert(1);
		}
	}

	#message-history {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: 10px;
		overflow: auto;
	}


	#send-message {
		.input-wrapper {
			color: #000;
			flex-grow: 1;
			border-radius: 4px;
			textarea {
				width: 100%;
				border-radius: 4px;
				display: block;
    			min-height: 50px;
				max-height: 150px;
				font-size: 16px;
				padding: 12px;
				box-sizing: border-box;
				height: 50px;
				color: #000;
			}
		}
		
		.btn_send {
			flex-grow: 0;
			width: 50px;
			border-radius: 4px;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
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
