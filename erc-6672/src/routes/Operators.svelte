
<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";
	import {Token} from "../lib/types";
	import {request} from "../lib/remoteRequest";
	import { getAllowedRedemptionIds, getOperators, getRedemptions } from "../lib/contract";
	

	let token: Token;
	let loading = true;
    let operators: string[] = [];
	let redemptions: {[key:string]: string[]} = {}
	let allowedRedemptions: {[key:string]: string[]} = {}

	function shortAddress(addr: string){
		return addr.substring(0,6) + "..." + addr.substring(addr.length - 4)
	}
	function shortBytes32(data: string){
		return data.substring(0,14) + "..." + data.substring(data.length - 4)
	}

	context.data.subscribe(async (value) => {
		if (!value.token)
			return;
		token = value.token;

        await reloadOperators()

		// You can load other data before hiding the loader
		loading = false;
	});

	async function reloadOperators(){
		loading = true;
		operators = await getOperators(token);
		await Promise.all(
		operators.map(async (element:string) => {
			redemptions[element] = await getRedemptions(token, element)
			allowedRedemptions[element] = JSON.parse(JSON.stringify(await getAllowedRedemptionIds(token, element)))
			// add current redemptions to the list of allowed redemptions
			redemptions[element].map(item=>{
				if (!allowedRedemptions[element].includes(item)){
					allowedRedemptions[element].push(item)
				}
			})
		}))
		// console.log({allowedRedemptions})
		// console.log({redemptions})
		loading = false;
	}

	async function requestOperatorRedeem(
		action: string,
		operator: string,
		redemptionID: string,
	){
		let message = {
			operator,
        	redemption: redemptionID,
		}
		const requestUri = `/${action}/${token.chainId}/${token.contractAddress}/${token.tokenId}`
		loading = true
		try {
			await request(requestUri, "post", message)
			await reloadOperators()
		}catch(e){
			console.error(e.message)
		}
		loading = false
	}

</script>

<div>
	{#if token}
		<div style="text-align: left;">
			<h2>Operators &amp; Redemptions</h2>
			<p>Here you can see list of operators for this contract and redemptions for your NFT#ID<br>Also you can request <strong>Virtual Predefined Operators</strong> to Redeem or Cancel specific Redemption for you NFT#ID</p>
			<p>Predefined Operators Mocked by service for DEMO purposes and it will do Redeem/Cancel actions once requested.</p>
		</div>

		<h3>Operators:</h3>
		{#if operators && operators.length}
			{#each operators as operator }
				<div class="operator">
					<div>Operator address:<strong class="short_address" title="{operator}">{shortAddress(operator)}</strong> </div>
					<div class="redemptions">
						{#if allowedRedemptions && allowedRedemptions[operator] && allowedRedemptions[operator].length}
							{#if !redemptions[operator] || !redemptions[operator].length}
								<div class="no_redemptions">No redemptions of this operator, 
									but you can ask operator to redeem 
								</div>
							{/if}
							<div class="redemption_ids_title">Allowed Redemptions for this operator:</div>
							{#each allowedRedemptions[operator] as redemption}
								<div class="item {redemptions[operator] && redemptions[operator].includes(redemption) ? "redeemed" : ""}">
									{#if redemptions[operator] && redemptions[operator].includes(redemption)}
										<div class="redemption_id">{redemption}</div>
										<div class="actions">
											<div class="action cancel" title="Ask Operator to cancel the redemption"
											role="button"
											tabindex="0"
											on:click={() => {
												requestOperatorRedeem("cancel", operator ,redemption);
											}}
											on:keypress={() => {
												requestOperatorRedeem("cancel", operator ,redemption);
											}}
											>Ask Operator to <strong>Cancel {shortBytes32(redemption)}</strong></div>
										</div>
									{:else}
										<div class="redemption_id inactive">{redemption}</div>
										<div class="actions">
											<div class="action cancel" title="Ask Operator to Redeem"
											role="button"
											tabindex="0"
											on:click={() => {
												requestOperatorRedeem("redeem", operator ,redemption);
											}}
											on:keypress={() => {
												requestOperatorRedeem("redeem", operator ,redemption);
											}}
											>Ask Operator to <strong>Redeem {shortBytes32(redemption)}</strong></div>
										</div>
									{/if}
								</div>
							{/each}
							
						{:else}
							<div class="no_redemptions">This operator didn't define redemption IDs, operator need to configure it</div>
						{/if}
						
					</div>
				</div>
			{/each}
		{/if}
	{/if}
	<Loader show={loading}/>
</div>

<style lang=scss>
	h2 {
		text-align: center;
	}
	.operator {
		background-color: #D7DAFD;
		border-radius: 8px;
		margin: 5px 0;
		padding: 5px;
	}
	.no_redemptions {
		color: #f00a;
		font-weight: 300;
		font-size: 0.9em;
	}
	.redemptions {
		.redemption_ids_title {
			font-weight: 500;
		}
		.item {
			font-size: 10px;
			background-color: #FDFAD7;
			margin: 5px 0;
			padding: 5px;
			border-radius: 4px;
			&.redeemed {
				background-color: rgb(175, 240, 174);
			}
			.redemption_id {
				font-size: 0.8em;
				color: blue;
				&.inactive {
					opacity: 0.7;
				}
			}
			
		}
	}
	.actions {
		// margin-top: 5px;
		// margin-bottom: 5px;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;

	}
	.action {
		cursor: pointer;
		margin-top: 5px;
		margin-right: 5px;
		font-size: 0.9em;
		padding: 0.2em;
		box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
		transition: opacity 0.2s;
		background: #D7DAFD;
		&:hover {
			opacity: 0.7;
		}
	}
</style>