<script lang="ts">
    import context from "../lib/context";
    import OperationStatus from "../components/OperationStatus.svelte"
	import Loader from "../components/Loader.svelte";

    
    let friendId = "";
    let loading = false;
    let client;
    let token;

    let resultStatus: boolean;
    let resultMessage: string;

    context.data.subscribe(async (value) => {
		if (!value.token)
			return;

		token = value.token;
		client = (await context.getMessageClient());
		// loading = false;
	});

    async function inviteFriend(){

        loading = true;
        try {
            let t = web3.tokens.data.currentInstance;
                
            try {
                friendId = BigInt(friendId).toString()
            } catch (e){
                throw new Error("Invalid token ID. Number or hex string allowed only")
            }
            if (!friendId || !t.tokenId){
                throw new Error("TokenId missing")
            }
            const result = await client.postInviteFriend(friendId);
            resultMessage = result.message;
            resultStatus = true;
            console.log({result});
            friendId = ""
            
        } catch (e){
            resultMessage = e.message;
            resultStatus = false;
            console.log("Invite send failed: " + e.message);
        }

        loading = false;
    }
</script>

<div>
    <h2>Invite New Friend:</h2>
    <h4>Enter Token ID to send Friend Request. Friendship required for chatting.</h4>
    <div id="invite-friend">
		<textarea id="message-input" on:keypress={() => {resultMessage=""}} bind:value={friendId} disabled={loading}></textarea>
		<button type="button" on:click={() => inviteFriend()} disabled={loading || !friendId.length}>Send Request</button>
	</div>
    <OperationStatus result={resultStatus} message={resultMessage} ></OperationStatus>
    <div class="loader-modal" style="display: {loading ? 'block' : 'none'}">
        <Loader show={loading} />
    </div>
</div>

<style>
    h4 {
        font-weight: 400;
    }
    #invite-friend {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    #message-input {
        flex-grow: 1;
    }
</style>