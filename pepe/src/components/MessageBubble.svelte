<script lang="ts">
	import { formatTokenBalance } from "../lib/utils";
	import numeral from "numeral";
	import { previewAddrStart } from "../lib/utils";
	import { emojiList } from "../lib/emoji-list"; // demo only
	export let message: {
		createdAt: number;
		sendingTokenAddress: string;
		maskedSendingTokenAddress?: string;
		message: string;
		messageDecoded: string;
		read: boolean;
		balance?: number;
		encrypted: boolean;
	};
	export let tokenDecimals: number | undefined;
	export let ownerAddress: string;
	export let position:string; // left or right

	const tokenBalance = message.balance && tokenDecimals ? formatTokenBalance(message.balance, tokenDecimals) : undefined;
	const tokenBalanceFormatted = numeral(tokenBalance).format("0.0a");

	let dateString: string;

	$: {
		const now = new Date();
		const date = new Date(message.createdAt);
		date.setTime(date.getTime() + now.getTimezoneOffset() * 60000);
		if (date.getDate() < now.getDate()) {
			dateString = date.toLocaleString();
		} else {
			dateString = date.toLocaleTimeString();
		}
	}
</script>

<!-- Group Chat -->
{#if message.maskedSendingTokenAddress && position === "left" }
	<div class="flex my-3 mb-[9px]">
		<img class="w-[48px]" style="width: 38px;height: 38px; border-radius: 38px;" src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/pepe-avatar.png" alt="avatar" />					
		<div class="w-[80%]">
			<div class="message-bubble {message.sendingTokenAddress?.toLowerCase() == ownerAddress?.toLowerCase() ? 'sender' : ''} ">
				<div class="message-content">
					{message.messageDecoded ? message.messageDecoded : message.message}
				</div>
			</div>
			<small class="message-meta">
				{dateString}
				{message?.maskedSendingTokenAddress ? 'Masked Fam Addr: ' + message?.maskedSendingTokenAddress.substring(0, 10) : ''}
				{tokenBalance ? 'HODLS: ' + tokenBalanceFormatted : ''}
			</small>
		</div>
	</div>
{:else if message.maskedSendingTokenAddress && position === "right" }
	<div class="flex justify-end my-3 mb-[9px]">
		<div class="right-side w-[80%]">
			<div class="message-bubble {message.sendingTokenAddress?.toLowerCase() == ownerAddress ? 'sender' : ''} ">
				<div class="message-content">
					{message.messageDecoded ? message.messageDecoded : message.message}
				</div>
			</div>
			<small class="message-meta">
				{dateString}
				{message?.maskedSendingTokenAddress ? 'Masked Fam Addr: ' + message?.maskedSendingTokenAddress.substring(0, 10) : ''}
				{tokenBalance ? 'HODLS: ' + tokenBalanceFormatted : ''}
			</small>
		</div>
		<img class="w-[48px]" style="width: 38px;height: 38px; border-radius: 38px;" src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/pepe-avatar.png" alt="avatar" />					
	</div>
{/if}

<!-- Peer to Peer -->
{#if message.sendingTokenAddress && message.sendingTokenAddress?.toLowerCase() !== ownerAddress?.toLowerCase() }
	<div class="flex my-3 mb-[9px]">
		<img class="w-[48px]" style="width: 38px;height: 38px; border-radius: 38px;" src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/pepe-avatar.png" alt="avatar" />					
		<div class="w-[80%]">
			<div class="message-bubble {message.sendingTokenAddress?.toLowerCase() == ownerAddress?.toLowerCase() ? 'sender' : ''} ">
				<div class="message-content">
					{message.messageDecoded ? message.messageDecoded : message.message}
				</div>
			</div>
			<small class="message-meta">
				{dateString}
				{message.sendingTokenAddress && message.sendingTokenAddress?.toLowerCase() !== ownerAddress?.toLowerCase() ?  '('+previewAddrStart(message.sendingTokenAddress)+')' : '(you)'}
				{message.encrypted ? 'Encrypted' : ''}
			</small>
		</div>
	</div>
{:else if message.sendingTokenAddress && !(message.sendingTokenAddress?.toLowerCase() !== ownerAddress?.toLowerCase())}
	<div class="flex justify-end my-3 mb-[9px]">
		<div class="right-side w-[80%]">
			<div class="message-bubble {message.sendingTokenAddress?.toLowerCase() == ownerAddress ? 'sender' : ''} ">
				<div class="message-content">
					{message.messageDecoded ? message.messageDecoded : message.message}
				</div>
			</div>
			<small class="message-meta">
				{dateString}
				{message.sendingTokenAddress && message.sendingTokenAddress?.toLowerCase() !== ownerAddress?.toLowerCase() ? '('+previewAddrStart(message.sendingTokenAddress)+')' : '(you)'}
				{message.encrypted ? 'Encrypted' : ''}
			</small>
		</div>
		<img class="w-[48px]" style="width: 38px;height: 38px; border-radius: 38px;" src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/pepe-avatar.png" alt="avatar" />					
	</div>
{/if}

<style lang="scss">
	.message-bubble {
		margin-left: 10px;
		border-radius: 10px;
		width: 100%;
		border: 1px solid #2f651b;
		color: #2f651b;
		border-radius: 0px 8px 8px 8px;
	
		.message-content {
			padding: 6px 6px 28px 6px;
			font-size: 14px;
			text-align: left;
			word-break: break-all;
		}
		&.sender {
			align-self: end;
			border-radius: 8px 0px 8px 8px;
		}
	}
	.message-meta {
		margin-left: 10px;
		margin-top: 5px;
		padding: 0 6px 6px;
		font-size: 11px;
		text-align: left;
		display: block;
		color: #545454;
	}

	.right-side {
		.message-bubble {
			margin-left: 0;
			position: relative;
			right: 10px;
			border-radius: 8px 0px 8px 8px;
			background: #2f651b;
			color: #fff;
			.message-content {
				text-align: left;
			}
		}
		.message-meta {
			position: relative;
			right: 10px;
			text-align: right;
		}
	}
</style>
