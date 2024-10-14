
<style>
	.button-container {
		display: flex;
        flex-wrap: wrap;
        gap: 24px;
	}

	:global(.button-container .btn) {
		flex: calc(50% - 16px);
	}
</style>

<div class="row button-container">
	<slot/>
</div>