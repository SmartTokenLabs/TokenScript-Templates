<script lang="ts">
	export let result: boolean;
	export let message: string;
	// let show
</script>

{#if message}
	<div class="box {result ? 'success' : 'error'}">
		{message}
	</div>
{/if}

<style>
	.box {
		background-color: #eee;
		padding: 10px;
		margin-top: 10px;
		word-wrap: break-word;
	}
	.box.success {
		color: green;
	}
	.box.error {
		color: red;
	}
</style>
