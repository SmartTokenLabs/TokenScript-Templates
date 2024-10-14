
<script lang="ts">
	import ActionButtons from "../components/ActionButtons.svelte";
	import {onMount} from "svelte";
	import {Icon} from "svelte-icon";
	import ArrowSvg from "../assets/img/swap-arrow.svg?raw";
	import PopoverModal from "../components/PopoverModal.svelte";
	import type {ITokenContextData} from "@tokenscript/card-sdk/dist/types";
	import {TOKEN_DETAILS} from "../lib/data";

	const router = tokenscript.eth.getContractInstance("DooarSwapRouter");

	export let token: ITokenContextData;

	let swapTokenLeft = token.contractAddress;
	let leftDetails = TOKEN_DETAILS[token.contractAddress];

	let swapTokenRight = Object.keys(TOKEN_DETAILS).find((a) => a !== token.contractAddress);
	let rightDetails = TOKEN_DETAILS[swapTokenRight];

	let swapAmtLeft = 0n;
	let swapAmtRight = 0n;
	let exactOutput = false;
	let slippageBps = 100n;
	let quoteLoading = false;
	let settingsOpen = false;
	let tokenSelectOpen = false;

	let leftContract: ethers.Contract;
	let leftBalance = 0n;

	let rightContract: ethers.Contract;
	let rightBalance = 0n;

	onMount(async () => {
		leftContract = tokenscript.eth.getContractInstance(leftDetails.symbol);
		leftBalance = await leftContract.balanceOf(token.ownerAddress);
		rightContract = tokenscript.eth.getContractInstance(rightDetails.symbol);
		rightBalance = await rightContract.balanceOf(token.ownerAddress);
	});

	async function updateSwapAmounts(left = true){

		tokenscript.action.showLoader();
		quoteLoading = true;

		try {
			if (left) {
				const amounts = await router.getAmountsOut(swapAmtLeft, [swapTokenLeft, swapTokenRight]);
				swapAmtRight = amounts[1];
				exactOutput = false;
			} else {
				const amounts = await router.getAmountsIn(swapAmtRight, [swapTokenLeft, swapTokenRight]);
				swapAmtLeft = amounts[0];
				exactOutput = true;
			}
		} catch (e: any) {
			console.error(e);
			tokenscript.action.showMessageToast("error", "Failed to load quote", e.message);
		}

		tokenscript.action.hideLoader();
		quoteLoading = false;
	}

	async function swap(){

		// Update amounts
		await updateSwapAmounts(!exactOutput);
		tokenscript.action.showLoader();

		let inputs = getInputs();

		const allowance = await leftContract.allowance(token.ownerAddress, router.target);

		// Execute approve TX if required
		if ((inputs.amountInMax ?? inputs.amountIn) > allowance){
			tokenscript.action.setProps({approveAmt: swapAmtLeft});
			if (!await tokenscript.action.executeTransaction(`approve${leftDetails.symbol}`)) {
				return;
			}
			await updateSwapAmounts(!exactOutput);
		}

		// Do swap
		inputs = getInputs();
		tokenscript.action.setProps(inputs);
		if (!await tokenscript.action.executeTransaction(exactOutput ? "swapTokensForExactTokens" : "swapExactTokensForTokens")) {
			return;
		}

		close();
	}

	function getInputs(){

		const inputs: any = {
			path: [swapTokenLeft, swapTokenRight],
			deadline: Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes
		}

		if (exactOutput){
			// Calculate slippage on input
			inputs.amountOut = swapAmtRight;
			inputs.amountInMax = swapAmtLeft + (swapAmtLeft * slippageBps / 10_000n);
		} else {
			// Calculate slippage on output
			inputs.amountIn = swapAmtLeft;
			inputs.amountOutMin = swapAmtRight - (swapAmtRight * slippageBps / 10_000n);
		}

		return inputs;
	}

</script>

<style>
    .swap-panel {
        display: flex;
        gap: 30px;
        padding: 10px 0 0;
        align-items: flex-start;
    }
    .token-header {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
        padding: 20px;
        margin: 10px 0;
        background: rgba(31, 31, 31, 1);
        border-radius: 8px;
    }
    .token-icon {
        width: 35px;
        height: auto;
    }
    .swap-left, .swap-right {
        flex: 50%;
        background: rgba(25, 25, 25, 1);
        border-radius: 12px;
        padding: 10px 30px;
        text-align: center;
    }

    .arrow-box {
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 40px;
        left: calc(50% - 40px);
        top: 125px;
        background: rgba(31, 31, 31, 1);
        border: 6px solid rgba(25, 25, 25, 1);
        padding: 10px;
    }

    .amount-input {
        width: 100%;
        height: 60px;
        text-align: center;
        font-weight: bold;
        background: rgba(25, 25, 25, 1);
        font-size: 32px;
        border: none !important;
    }

    .amount-box {
        margin: 30px 10px 10px;
    }

    .balance-box {
        font-size: 14px;
    }

    .balance-box .label {
        color: rgba(175, 175, 175, 1)
    }

    .balance-box .balance {
        color: rgba(117, 117, 117, 1);
    }

    .slippage-header, .slippage-opts, .token-opts {
        display: flex;
        align-items: center;
        margin: 5px 10px;
        gap: 10px;
    }

    .token-opts {
        display: flex;
		flex-direction: column;
        align-items: center;
        margin: 5px 10px;
        gap: 10px;
    }

	.token-opts button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        height: 60px;
	}

    .slippage-opts button, .token-opts button  {
        color: white;
        font-size: 18px;
        background: rgba(12, 10, 10, 1);
        border: 1px solid rgba(12, 10, 10, 1);
    }
    .slippage-opts button:hover, .token-opts button:hover {
        background: inherit;
        border: 1px solid rgb(255, 88, 36) !important;
    }
    :focus {outline:none;}
    ::-moz-focus-inner {border:0;}
    .slippage-input {
        position: relative;
    }
    .slippage-input input {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        font-size: 18px;
    }
    .slippage-input input:focus {
        border-color: rgb(255, 88, 36) !important;
    }
    .slippage-input strong {
        position: absolute;
        right: 10px;
        top: 0;
        height: 40px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .close-btn {
        cursor: pointer;
    }
</style>

<div>
	<div class="row">
		<div class="swap-panel">
			<div class="swap-left">
				<div class="token-header">
					<img class="token-icon" alt={leftDetails.symbol} src={leftDetails.icon} />
					<strong>{leftDetails.symbol}</strong>
				</div>
				<div class="balance-box">
					<span class="label">Balance:</span>
					<span class="balance">{parseFloat(Number(ethers.formatUnits(leftBalance, leftDetails.decimals)).toFixed(4))}</span>
				</div>
				<div class="amount-box">
					<input class="amount-input" type="number"
						   title={ethers.formatUnits(swapAmtLeft, leftDetails.decimals)}
						   value={parseFloat(Number(ethers.formatUnits(swapAmtLeft, leftDetails.decimals)).toFixed(4))}
						   on:change={async (e) => {
							   swapAmtLeft = ethers.parseUnits(e.target.value, leftDetails.decimals);

							   if (!swapAmtLeft){
								   swapAmtRight = 0n;
								   return;
							   }

							   await updateSwapAmounts(true);
						   }}
						   on:focus={(e) => e.target.select()} />
				</div>
			</div>
			<div class="arrow-box">
				<Icon data={ArrowSvg} width="100%" height="100%" stroke="unset" />
			</div>
			<div class="swap-right">
				<div class="token-header" style="cursor: pointer" on:click={() => tokenSelectOpen = true}>
					<img class="token-icon" alt={rightDetails.symbol} src={rightDetails.icon} />
					<strong>{rightDetails.symbol}</strong>
					<strong style="font-size: 40px; line-height: 20px; position: relative; top: -16px;">⌄</strong>
				</div>
				<div class="balance-box">
					<span class="label">Balance:</span>
					<span class="balance">{parseFloat(Number(ethers.formatUnits(rightBalance, rightDetails.decimals)).toFixed(4))}</span>
				</div>
				<div class="amount-box">
					<input class="amount-input" type="number"
						   title={ethers.formatUnits(swapAmtRight, rightDetails.decimals)}
						   value={parseFloat(Number(ethers.formatUnits(swapAmtRight, rightDetails.decimals)).toFixed(4))}
						   on:change={async (e) => {
							   swapAmtRight = ethers.parseUnits(e.target.value, rightDetails.decimals);

							   if (!swapAmtRight){
								   swapAmtLeft = 0n;
								   return;
							   }

							   await updateSwapAmounts(false);
						   }}
						   on:focus={(e) => e.target.select()} />
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="balance-box">
			<span class="label">1 {leftDetails.symbol} = {
				!swapAmtLeft || !swapAmtRight || quoteLoading ? "?" :
					(parseFloat(Number(ethers.formatUnits(swapAmtLeft, leftDetails.decimals)).toFixed(4)) / parseFloat(Number(ethers.formatUnits(swapAmtRight, rightDetails.decimals)).toFixed(4))).toFixed(4)
			} {rightDetails.symbol}</span>
		</div>
		<div class="balance-box" style="margin-top: 4px;">
			<span class="label">Slippage: </span>
			<span class="value">{Number(slippageBps) / 100}%</span>
		</div>
		{#if swapAmtLeft > leftBalance}
			<small class="task-hint-text" style="text-align: center;">Insufficient balance</small>
		{/if}
	</div>
	<ActionButtons>
		<button class="btn btn-primary" style="flex: 100%"
				disabled={!swapAmtLeft || !swapAmtRight || quoteLoading || swapAmtLeft > leftBalance}
				on:click={() => swap()}>
			<span>Swap</span>
		</button>
		<button class="btn btn-secondary" style="flex: 100%" on:click={() => settingsOpen = true}>
			<span>Settings</span>
		</button>
	</ActionButtons>
</div>

{#if tokenSelectOpen}
	<PopoverModal title={"Select Token"} dismissCallback={() => {
			tokenSelectOpen = false;
		}}>
		<div class="row token-opts">
			{#each Object.keys(TOKEN_DETAILS).filter((addr) => addr !== token.contractAddress) as address}
				<button class="btn" on:click={async () => {
					tokenscript.action.showLoader();
					rightContract = address;
					rightDetails = TOKEN_DETAILS[address];
					rightBalance = 0n;
					swapAmtRight = 0n;
					rightContract = tokenscript.eth.getContractInstance(rightDetails.symbol);
					rightBalance = await rightContract.balanceOf(token.ownerAddress);
					if (swapAmtLeft > 0n)
						await updateSwapAmounts(true);
					tokenSelectOpen = false;
					tokenscript.action.hideLoader();
				}}>
					<img class="token-icon" alt={TOKEN_DETAILS[address].name} src={TOKEN_DETAILS[address].icon}/>
					{TOKEN_DETAILS[address].name}
				</button>
			{/each}
		</div>
	</PopoverModal>
{/if}

{#if settingsOpen}
	<PopoverModal title={"Swap settings"} hideTitleBar={true} dismissCallback={() => {
			settingsOpen = false;
		}}>
		<div class="slippage-header">
			<h2 style="flex-grow: 1;">Slippage Tolerance</h2>
			<h1 class="close-btn" on:click={() => settingsOpen = false}>X</h1>
		</div>
		<div class="row slippage-opts">
			<button class="btn" on:click={() => slippageBps = 50n}>0.5%</button>
			<button class="btn" on:click={() => slippageBps = 100n}>1%</button>
			<button class="btn" on:click={() => slippageBps = 500n}>5%</button>
		</div>
		<div class="row slippage-input">
			<input type="number"
				   value={Number(slippageBps) / 100}
				   on:change={async (e) => {
					   slippageBps = BigInt(Math.round(e.target.value * 100));
				   }}
				   on:focus={(e) => e.target.select()}/>
			<strong>%</strong>
		</div>
	</PopoverModal>
{/if}

