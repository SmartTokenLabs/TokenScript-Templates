
<script lang="ts">
	export let dismissCallback: ()=>void|null = null;
	export let title: string|null = null;
	export let hideTitleBar = false;

	const id = Date.now();

	function dismiss(){
		if (dismissCallback) {
			dismissCallback();
			dismissCallback = null;
		}
	}
</script>

<style>
	.popover-modal {
		position: absolute;
		left: 0;
		height: 100%;
		width: 100%;
		top: 0;
		background-color: #00000082;
		align-items: center;
		justify-content: center;
		display: none;
		overflow: hidden;
		z-index: 100;
	}

	.popover-modal.open {
		display: flex !important;
		animation: fadeIn 0.25s;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.popover-modal.open .popover-container {
		bottom: 0 !important;
		animation: slideIn 0.25s;
	}

	@keyframes slideIn {
		0% {
			transform: translateY(500px);
			animation-timing-function: ease-out;
		}
		100% {
			transform: translateY(0px);
			animation-timing-function: ease-in;
		}
	}

	.popover-container {
		box-sizing: border-box;
		position: absolute;
		height: fit-content;
		max-height: 100%;
		width: 100%;
        background: #212121;
		border-radius: 8px;
		bottom: -100%;
		animation: slideIn 0.5s reverse;
		display: flex;
		flex-direction: column;
	}

	.title-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #D4D3D3;
        margin: 30px 0 0;
        padding-bottom: 20px;
	}

	.title {
        font-size: 18px;
        margin: 0 20px;
    }

	.close-btn {
		position: absolute;
		z-index: 100;
		left: 24px;
		cursor: pointer;

	}

	.close-btn span {
        font-weight: bold;
        line-height: 24px;
        font-size: 24px;
	}

	.close-btn:hover {
		color: #cacaca;
	}

	.popover-inner {
		position: relative;
		overflow: auto;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		overflow-x: hidden;
		padding: 0 15px 15px;
	}

	@media (max-width: 500px) {
		.popover-modal {
			align-items: end;
		}
		.popover-container {
			border-radius: 8px 8px 0 0 !important;
		}
	}

</style>

<div class={"popover-modal " + id + (open ? ' open' : '')} on:click={(e) => {
	if (e.target.classList.contains(id))
		dismiss();
}}>
	<div class="popover-container">
		{#if !hideTitleBar}
		<div class="title-bar">
			<h2 class="title">{title}</h2>
			<button class="close-btn btn btn-secondary" on:click={() => dismiss()}><span>&lt;</span></button>
		</div>
		{/if}

		<div class="popover-inner">
			<slot/>
		</div>
	</div>
</div>
