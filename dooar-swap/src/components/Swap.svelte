
<script lang="ts">
	import SUTIcon from "../assets/img/SUT-icon.png";
	import GMTIcon from "../assets/img/GMT-icon.png";
	import ActionButtons from "./ActionButtons.svelte";
	import {onMount} from "svelte";
	import {Icon} from "svelte-icon";
	import ArrowSvg from "../assets/img/swap-arrow.svg?raw";
	import PopoverModal from "./PopoverModal.svelte";

	const router = tokenscript.eth.getContractInstance("DooarSwapRouter");

	export let close: () => void;
	export let ownerAddress: string;

	let swapTokenLeft = tokenscript.eth.getContractInfo("GMT").address; // GMT
	let decimalsLeft = 8n;
	let swapTokenRight = tokenscript.eth.getContractInfo("SUT").address; // SUT
	let decimalsRight = 18n;
	let swapAmtLeft = 0n;
	let swapAmtRight = 0n;
	let exactOutput = false;
	let slippageBps = 100n;
	let quoteLoading = false;
	let settingsOpen = false;

	let gmt: ethers.Contract;
	let gmtBalance = 0n;

	let sut: ethers.Contract;
	let sutBalance = 0n;

	onMount(async () => {
		gmt = tokenscript.eth.getContractInstance("GMT");
		gmtBalance = await gmt.balanceOf(ownerAddress);
		sut = tokenscript.eth.getContractInstance("SUT");
		sutBalance = await sut.balanceOf(ownerAddress);
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

		const allowance = await gmt.allowance(ownerAddress, router.target);

		// Execute approve TX if required
		if ((inputs.amountInMax ?? inputs.amountIn) > allowance){
			tokenscript.action.setProps({approveAmt: swapAmtLeft});
			if (!await tokenscript.action.executeTransaction("approveGMTForSwap")) {
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

    .slippage-header, .slippage-opts {
        display: flex;
        align-items: center;
		margin: 5px 10px;
		gap: 10px;
    }
    .slippage-opts button {
		color: white;
		font-size: 18px;
		background: rgba(12, 10, 10, 1);
		border: 1px solid rgba(12, 10, 10, 1);
    }
    .slippage-opts button:hover {
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
					<img class="token-icon" alt="SUT" src={GMTIcon} />
					<strong>GMT</strong>
				</div>
				<div class="balance-box">
					<span class="label">Balance:</span>
					<span class="balance">{parseFloat(Number(ethers.formatUnits(gmtBalance, decimalsLeft)).toFixed(4))}</span>
				</div>
				<div class="amount-box">
					<input class="amount-input" type="number"
						   title={ethers.formatUnits(swapAmtLeft, decimalsLeft)}
						   value={parseFloat(Number(ethers.formatUnits(swapAmtLeft, decimalsLeft)).toFixed(4))}
						   on:change={async (e) => {
							   swapAmtLeft = ethers.parseUnits(e.target.value, decimalsLeft);

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
				<div class="token-header">
					<img class="token-icon" alt="SUT" src={SUTIcon} />
					<strong>SUT</strong>
				</div>
				<div class="balance-box">
					<span class="label">Balance:</span>
					<span class="balance">{parseFloat(Number(ethers.formatUnits(sutBalance, decimalsRight)).toFixed(4))}</span>
				</div>
				<div class="amount-box">
					<input class="amount-input" type="number"
						   title={ethers.formatUnits(swapAmtRight, decimalsRight)}
						   value={parseFloat(Number(ethers.formatUnits(swapAmtRight, decimalsRight)).toFixed(4))}
						   on:change={async (e) => {
							   swapAmtRight = ethers.parseUnits(e.target.value, decimalsRight);

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
			<span class="label">1 SUT = {
				!swapAmtLeft || !swapAmtRight || quoteLoading ? "?" :
					(parseFloat(Number(ethers.formatUnits(swapAmtLeft, decimalsLeft)).toFixed(4)) / parseFloat(Number(ethers.formatUnits(swapAmtRight, decimalsRight)).toFixed(4))).toFixed(4)
			} GMT</span>
		</div>
		<div class="balance-box" style="margin-top: 4px;">
			<span class="label">Slippage: </span>
			<span class="value">{Number(slippageBps) / 100}%</span>
		</div>
		{#if swapAmtLeft > gmtBalance}
			<small class="task-hint-text" style="text-align: center;">Insufficient balance</small>
		{/if}
	</div>
	<ActionButtons>
		<button class="btn btn-primary" style="flex: 100%"
				disabled={!swapAmtLeft || !swapAmtRight || quoteLoading || swapAmtLeft > gmtBalance}
				on:click={() => swap()}>
			<span>Swap</span>
		</button>
		<button class="btn btn-secondary" style="flex: 100%" on:click={() => settingsOpen = true}>
			<span>Settings</span>
		</button>
	</ActionButtons>
</div>

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

