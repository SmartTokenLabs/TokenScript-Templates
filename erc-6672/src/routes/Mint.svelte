<script lang="ts">
	import context from "../lib/context";
	import { Token } from "../lib/types";
	import Loader from "../components/Loader.svelte";

	let token: Token;
	let loading = true;
    let mintTo = ""

	context.data.subscribe(async (value) => {
		if (!value.token)
			return;
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;
	});

    function setTransactionParams() {
		web3.action.setProps({ 
			mintTo
		});
	}

</script>

<div>
	{#if token}
    <div class="screen_wrap">
            <h3>Mint NFT</h3>
            <div class="input-wrap">
                Enter Wallet address to Mint NFT for and click button "Mint"
                <input id="mintTo" type="text" bind:value={mintTo} on:change={ setTransactionParams }  on:keyup={ setTransactionParams } >
            </div>
        </div>
	{/if}
	<Loader show={loading}/>
</div>

<style lang=scss>
    .screen_wrap {
        
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 10px;
        .input-wrap {
            input {
                width: 100%;
                padding: 5px;
            }
        }
    }
</style>
