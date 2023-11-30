<script lang="ts">
	export let message: {
		createdAt: number;
		sendingTokenId: number;
		message: string;
		messageDecoded: string;
		read: boolean;
		encrypted: boolean;
	};
	export let senderTokenId: number;

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

<div class="message-bubble {message.sendingTokenId == senderTokenId ? 'sender' : ''}">
	<div class="message-content">
		{message.messageDecoded ? message.messageDecoded : message.message}({message.encrypted ? "enc" : "raw"})
	</div>
	<small class="message-meta">
		{message.sendingTokenId == senderTokenId && message.read ? '✓ (seen) ' : ''}
		{dateString}
	</small>
</div>

<style lang="scss">
	.message-bubble {
		margin: 5px;
		border-radius: 10px;
		width: 80%;
		background: #70ffa1;
		color: #000;
	}

	.message-content {
		padding: 6px;
		font-size: 14px;
		text-align: left;
		word-break: break-all;
	}

	.message-meta {
		padding: 0 6px 6px;
		font-size: 11px;
		text-align: right;
		display: block;
	}

	.message-bubble.sender {
		align-self: end;
		background: #0084ff;
		color: #fff;
	}
</style>
