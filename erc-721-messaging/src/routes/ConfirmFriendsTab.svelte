<script lang="ts">
import context from "../lib/context";
import {showLoader} from "../lib/storage";
import OperationStatus from "../components/OperationStatus.svelte"

let loading = false;
let client;
let token;
let invites = [];

let resultStatus: boolean;
let resultMessage: string;

const loadInvites = async () => {
    showLoader.set(true)
    try {
        invites = await client.getFriendInvites();
        console.log(invites)
        if (invites.length){
            resultMessage = "Invites fetched succesfully";
        } else {
            resultMessage = "No pending invites";
        }
        resultStatus = true;
    } catch (e){
        resultMessage = "Invite send failed: " + e.message;
        resultStatus = false;
    }
    showLoader.set(false)
}

async function inviteFriend(friendId: number){
    showLoader.set(true)
    try {
        const result = await client.postInviteFriend(friendId);
        resultMessage = result.message;
        resultStatus = true;
        let newInvites = invites.filter(item=>{
            // remove Approved invite from list
            return item.sendingTokenId != friendId.toString()
        })
        invites = newInvites

    } catch (e){
        resultMessage = "Invite send failed: " + e.message;
        resultStatus = false;
    }
    showLoader.set(false)
}

context.data.subscribe(async (value) => {
    if (!value.token)
        return;

    token = value.token;
    showLoader.set(true)
    client = (await context.getMessageClient());
    try {
        await loadInvites();
    } catch (e: any){
        resultStatus = false
        resultMessage = "Message load failed: " + e.message;
    }
    showLoader.set(false)
    // reloadTimer = setInterval(() => loadThreads(), 60000);
});

</script>

<div>
    <h2>Confirm Friends Requests:</h2>
    <h4>Please click friends requests to confirm friendship if you want to chat with those NFT owners.</h4>

    <div class="invites">
        {#each invites as invite}
            <div class="invite"  role="button" tabindex="0" on:click={()=>{inviteFriend(invite.sendingTokenId)}} on:keypress={()=>{inviteFriend(invite.sendingTokenId)}}>
                Approve friend request NFT#{invite.sendingTokenId}
            </div>
        {/each}
    </div>
    
    <OperationStatus result={resultStatus} message={resultMessage} ></OperationStatus>
    
</div>

<style>
    h4 {
        font-weight: 400;
    }
    .invite {
        background-color: #eee;
        padding: 5px;
        cursor: pointer;
        border-radius: 4px;
        box-shadow: 3px 2px 6px #888;
    }
</style>