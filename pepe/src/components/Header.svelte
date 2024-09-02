<script lang="ts">
	import context from '../lib/context';
	import { Token } from '../lib/types';

	let token: Token;

	context.data.subscribe((value) => {
		if (value.token) token = value.token;

	});
</script>

{#if token}
	<div class="cat-header">
		<div>
			<img alt="your Token" class="token-image" src={token.image_preview_url} />
		</div>
		<div class="cat-details">
			<h2>{token.name}</h2>
			<div class="cat-stats">
				<div>ID: {token.ownerAddress}</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.token-image {
		max-width: 100%;
		width: 100px;
	}

	.cat-header {
		display: flex;
		margin: 15px 10px;
	}

	.cat-details {
		flex-grow: 1;
		padding: 10px;
		text-align: left;
	}

	.cat-details h2 {
		margin-top: 0;
		margin-bottom: 10px;
	}
</style>
