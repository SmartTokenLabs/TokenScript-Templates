<script lang="ts">
	import context from "../lib/context";
	import { Token } from "../lib/types";
	import Loader from "../components/Loader.svelte";

	let token: Token;
	let loading = true;
    let operator = ""

	context.data.subscribe(async (value) => {
		if (!value.token)
			return;
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;
	});

    function setTransactionParams() {
		// @ts-ignore
        console.log("Oper: ", operator)
		web3.action.setProps({ 
			operator
		});
	}

</script>

<div>
	{#if token}
    <div class="screen_wrap">
            <h3>Add New Operator</h3>
            <div class="input-wrap">
                Enter Wallet address of new Operator to add click button "Add new Operator":
                <input type="text" bind:value={operator} on:change={ setTransactionParams }  on:keyup={ setTransactionParams } >
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
