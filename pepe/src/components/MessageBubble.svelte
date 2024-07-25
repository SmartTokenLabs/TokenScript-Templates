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

<div class="message-bubble {message.sendingTokenId == senderTokenId ? 'sender' : ''} ">
	<div class="message-content">
		{message.messageDecoded ? message.messageDecoded : message.message}
	</div>
	<small class="message-meta">
		{message.sendingTokenId == senderTokenId && (message.read || message.openedAt) ? '✓ (seen) ' : ''}
		{dateString}
	</small>
</div>

<style lang="scss">
	.message-bubble {
		margin: 5px;
		border-radius: 10px;
		width: 80%;
		background: #EEEEEE;
		border-radius: 0px 8px 8px 8px;
		color: #000;
	

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
			color: #545454;
			
		}

		&.sender {
			align-self: end;
			border-radius: 8px 0px 8px 8px;
		}
		&.new, &.sender  {
			background: linear-gradient(234.79deg, #001AFF 37.73%, #4F95FF 118.69%);
			color: #fff;
			.message-meta {
				color: #cecece;
			}
		}
	}
</style>
