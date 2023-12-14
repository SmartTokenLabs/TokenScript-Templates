<script lang="ts">
	import context from "../lib/context";
	import { Token } from "../lib/types";
    import { encodeBytes32String } from 'ethers';
	import Loader from "../components/Loader.svelte";

	let token: Token;
	let loading = true;
    let redeemTokenId = ""
    let rawRedeemTokenId = ""
    let redemptionId = ""
    let rawRedemptionId = ""
    let error = ""

	context.data.subscribe(async (value) => {
		if (!value.token)
			return;
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;
	});

    function setTransactionParams() {
		// @ts-ignore
        const hexRegex = /^0x[a-fA-F0-9]+$/;
        try {
            redeemTokenId = BigInt(rawRedeemTokenId).valueOf().toString().substring(0,66)
            if (hexRegex.test(rawRedemptionId)){
                redemptionId = rawRedemptionId
            } else {
                redemptionId = encodeBytes32String(rawRedemptionId)
            }
            redemptionId = redemptionId.substring(0,66).padEnd(66,"0")

            error = ""
            let propsData = { 
                redeemTokenId,
                redemptionId
            }
            web3.action.setProps(propsData);
        } catch(e){
            error = e.message
        }
	}

</script>

<div>
	{#if token}
    <div class="screen_wrap">
            <h3>Redeem</h3>
            <div class="content">
                {#if error}
                <div class="error">{error}</div>
                {/if}
                <div class="h4">Enter Existing Token ID and Redemption ID then click button "Redeem"</div>
                <div class="input-wrap">

                    <label for="rawRedeemTokenId">Token ID (number or HEX string)</label>
                    <input id="rawRedeemTokenId" type="text" bind:value={rawRedeemTokenId} on:change={ setTransactionParams }  on:keyup={ setTransactionParams } >
                    <input id="redeemTokenId" type="text" readonly disabled bind:value={redeemTokenId} >
                </div>

                <div class="input-wrap">

                    <label for="rawRedemptionId">Redemption ID (32 bytes HEX or URF8 string. UTF8 string will be converted to HEX and cropped to 32 bytes)</label>
                    <input id="rawRedemptionId" type="text" bind:value={rawRedemptionId} on:change={ setTransactionParams }  on:keyup={ setTransactionParams } >
                    <input id="redemptionId" type="text" readonly disabled bind:value={redemptionId} >
                </div>
                    
            </div>
        </div>
	{/if}
	<Loader show={loading}/>
</div>

<style lang=scss>
    .content {
        background-color: #FDFAD7;
        border-radius: 4px;
        padding: 5px;
    }
    .error {
        border-radius: 4px;
        background-color: lightpink;
        margin: 10px 0;
        padding: 5px;
    }
    .input-wrap {
        margin-top: 10px;
        background-color: #D7DAFD;
        border-radius: 4px;
        padding: 5px;
        input {
            margin-bottom: 5px;
            border-radius: 4px;
        }
    }
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
