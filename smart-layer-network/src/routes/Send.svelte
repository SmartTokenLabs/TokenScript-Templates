<script lang="ts">
	import SlnLogo from '../components/SlnLogo.svelte';
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	let token: ITokenContextData;
	let tokenAmount: number | string = 0;
	let loading = true;
	let receivingAccountAddress: string | undefined;
	let receivingAmountViewValue: any;
	let receivingAmount: any;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;

		// @ts-ignore
		if (token._count && Number(ethers.formatEther(token._count)) > 0.000000000000000001) {
			tokenAmount = ethers.formatEther(token._count);
		}

		// You can load other data before hiding the loader
		loading = false;
	});

	function setRecievingAddress(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		receivingAccountAddress = inputElement.value;
		updateWeb3Props();
	}

	async function setTokenAmount(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		receivingAmountViewValue = inputElement.value;
		receivingAmount = ethers.parseEther(inputElement.value);
		updateWeb3Props();
	}

	function updateWeb3Props() {
		web3.action.setProps({
			sendingAccountAddress: token.ownerAddress,
			receivingAccountAddress,
			receivingAmount
		});
	}
</script>

<div>
	{#if token}
		<div id="token-container" style="background: black;color: white;">
			<div class="flex-center" style="margin: 40px 0;">
				<SlnLogo />
			</div>
			<div class="flex-center">
				<div>
					<img
						alt="sln"
						src="https://www.tokenscript.org/images/tokenscript-large-cube.png"
						style="width: 118px"
					/>
					<p style="text-align: center;">Send Tokens</p>
				</div>
			</div>
			<div class="field-section">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Token Balance</div>
				</div>
				<div class="field-container">
					<div class="field-value">{tokenAmount + ' SLN' ?? '-'}</div>
				</div>
			</div>
			<div class="field-section">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Send Address</div>
					<img
						class="field-icon"
						alt="wallet"
						src="https://www.smartlayer.network/_next/static/media/wallet.74ee044d.svg"
					/>
				</div>
				<input
					minlength="42"
					maxlength="42"
					on:change={(event) => {
						setRecievingAddress(event);
					}}
					placeholder=""
					id="recieving-account"
					style="padding: 12px 14px;width: 100%;border-radius: 4px;border: 1px solid #B6B6BF;border-radius: 14px;margin: 5px 0;"
					type="text"
				/>

				{#if receivingAccountAddress && !ethers.isAddress(receivingAccountAddress)}
					<div style="color: red; padding: 12px 0;">Please enter a valid account address.</div>
				{/if}

				<div class="flex-between field-section-heading">
					<div class="field-section-title">Send Amount</div>
				</div>
				<input
					on:change={(event) => {
						setTokenAmount(event);
					}}
					placeholder=""
					id="sending-account"
					style="padding: 12px 14px;width: 100%;border-radius: 4px;border: 1px solid #B6B6BF;border-radius: 14px;margin: 5px 0;"
					type="number"
				/>

				{#if receivingAmountViewValue && Number(receivingAmountViewValue) > Number(tokenAmount)}
					<div style="color: red; padding: 12px 0;">
						Please enter a value equal to or less than your balance.
					</div>
				{/if}
			</div>

			<div class="field-section">
				{#if receivingAccountAddress && receivingAmountViewValue && Number(receivingAmountViewValue) <= Number(tokenAmount)}
					<div class="flex-between field-section-heading">
						<div class="field-section-title">Summary</div>
					</div>
					<div class="field-container">
						<div class="field-title">From</div>
						<div class="field-value">{token.ownerAddress}</div>
					</div>
					<div class="field-container">
						<div class="field-title">Amount</div>
						<div class="field-value">
							{receivingAmountViewValue ? receivingAmountViewValue + ' SLN' : '-'}
						</div>
					</div>
					<div class="field-container">
						<div class="field-title">To</div>
						<div class="field-value">{receivingAccountAddress ?? '-'}</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
