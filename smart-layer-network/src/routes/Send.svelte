<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	import { formatWithByDecimalPlaces } from '../lib/utils';
	import SlnLogo3 from '../components/SLNLogo3.svelte';

	let token: ITokenContextData;
	let tokenAmount: number | string = 0;
	let loading = true;
	let receivingAccountAddress: string | undefined;
	let receivingAmountViewValue: any;
	let receivingAmount: any;
	let timeout: any;
	let subView: 'SEND' | 'SUMMARY' = 'SEND';
	let formIsInValid = true;

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

		inputElement.checkValidity();
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
		validateForm();
	}

	function validateForm() {
		let sendingAmountInput = document.getElementById('sending-amount') as HTMLInputElement;
		let sendingAccountInput = document.getElementById('sending-account') as HTMLTextAreaElement;
		if (sendingAmountInput && sendingAccountInput) {
			formIsInValid = !(
				sendingAmountInput.checkValidity() &&
				sendingAccountInput.checkValidity() &&
				ethers.isAddress(receivingAccountAddress) &&
				receivingAmountViewValue > 0
			);
		}
	}
</script>

<div>
	{#if token}
		{#if subView === 'SEND'}
			<div id="token-container" class="text-white">
				<div class="field-section">
					<div class="field-section-title neue-plak" style="font-size: 24px;">Send $SLN</div>
				</div>
				<div class="field-section">
					<div class="field-title">Amount</div>
					<div class="icon-input">
						<input
							class="neue-plak large"
							on:input={(event) => {
								if (timeout) clearTimeout(timeout);
								timeout = setTimeout(() => {
									setTokenAmount(event);
								}, 300);
							}}
							bind:value={receivingAmountViewValue}
							placeholder="0.00"
							id="sending-amount"
							type="number"
							max={formatWithByDecimalPlaces(Number(tokenAmount), 2)}
							min="0.01"
							step="any"
						/>
						<span class="flex">
							<div
								style="align-items: center; height: 24px; width: 24px; border-radius: 24px; background: #001AFF; padding: 1.5px 0 0 1.5px; margin-right: 9px; margin-top:2px"
							>
								<SlnLogo3 />
							</div>
							<div style="font-size: 20px;">$SLN</div>
						</span>
					</div>
					{#if receivingAmountViewValue && Number(receivingAmountViewValue) > Number(tokenAmount)}
						<div class="input-error">Please enter a value equal to or less than your balance.</div>
					{/if}
					<p style="font-size: 16px; margin: 24px 0 48px 0">
						Your Balance <span style="text-decoration: underline;"
							>{tokenAmount
								? formatWithByDecimalPlaces(Number(tokenAmount), 2) + ' $SLN'
								: '0.00'}</span
						>
					</p>
					<div class="field-title">Recipient address</div>

					<textarea
						rows="2"
						cols="1"
						class="neue-plak"
						on:input={(event) => {
							if (timeout) clearTimeout(timeout);
							timeout = setTimeout(() => {
								setRecievingAddress(event);
							}, 300);
						}}
						bind:value={receivingAccountAddress}
						placeholder="0x123"
						id="sending-account"
						minlength="42"
						maxlength="42"
					/>

					{#if receivingAccountAddress && !ethers.isAddress(receivingAccountAddress)}
						<div class="input-error">Please enter a valid account address.</div>
					{/if}
				</div>
			</div>
			<div class="field-section" style="width: 100%; position: fixed; bottom: 0;">
				<button
					disabled={formIsInValid}
					class="gradient-button"
					on:click={(e) => (subView = 'SUMMARY')}>Review</button
				>
			</div>
		{/if}
		{#if subView === 'SUMMARY'}
			<div class="field-section" style="display: flex; align-items: center; padding-bottom: 0;">
				<button class="cursor-button" on:click={(e) => (subView = 'SEND')}>{'<'}</button>
				<div
					class="field-section-title neue-plak"
					style="font-size: 18px; margin-left: 9px; margin-top: 4px"
				>
					Summary
				</div>
			</div>
			<div class="field-section">
				<div class="field-container">
					<div class="field-title">From</div>
					<div class="field-value-alt">{token.ownerAddress}</div>
				</div>
				<div class="field-container">
					<div class="field-title">To</div>
					<div class="field-value-alt">{receivingAccountAddress ?? '-'}</div>
				</div>
				<div class="field-container">
					<div class="field-title">Amount</div>
					<div class="field-value-alt">
						{receivingAmountViewValue ? receivingAmountViewValue + ' $SLN' : '-'}
					</div>
				</div>
			</div>
			<div class="field-section" style="width: 100%; position: fixed; bottom: 0;">
				<!-- svelte-ignore missing-declaration -->
				<button
					style="opacity: 0;"
					class="delay-show-1s gradient-button"
					on:click={(e) =>
						// @ts-ignore
						tokenscript.action.executeTransaction()}>Send</button
				>
			</div>
		{/if}
	{/if}
	<Loader show={loading} />
</div>
