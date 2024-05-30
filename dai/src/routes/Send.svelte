<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	import {
		formatWithByDecimalPlaces,
		previewAddr,
		fetchENSImage,
		formatTokenBalance
	} from '../lib/utils';

	let token: ITokenContextData;
	let tokenAmount: number | string = 0;
	let loading = true;
	let receivingAccountAddress: string | undefined;
	let receivingAmountViewValue: any;
	let receivingAmount: any;
	let timeout: any;
	let subView: 'SEND' | 'SUMMARY' = 'SEND';
	let formIsInValid = true;
	let receivingAccountAddressViewValue: string | undefined;
	let ensNameNotFound: boolean | undefined;
	let ensNameAvatarImage: any;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		const balance = formatTokenBalance(token?._count, token?.decimals);
		if (balance !== 0) tokenAmount = balance;
		loading = false;
	});

	async function getENSAvatar(ensName: string) {
		try {
			const ensNameAvatarImageReq: any = await fetchENSImage(ensName);
			ensNameAvatarImage = URL.createObjectURL(ensNameAvatarImageReq);
			ensNameNotFound = false;
		} catch (e) {
			ensNameAvatarImage = undefined;
			ensNameNotFound = true;
		}
	}

	async function getAddressFromENS(ensName: string) {
		const provider = ethers.getDefaultProvider();
		try {
			const address = await provider.resolveName(ensName);
			if (address) {
				receivingAccountAddress = address;
			}
			ensNameNotFound = false;
		} catch (error) {
			receivingAccountAddress = undefined;
			ensNameNotFound = true;
		}
	}

	async function setRecievingAddress(event: Event) {
		const inputElement = event.target as HTMLInputElement;

		if (inputElement.value.endsWith('.eth')) {
			loading = true;
			await getAddressFromENS(inputElement.value);
			await getENSAvatar(inputElement.value);
			loading = false;
		} else {
			receivingAccountAddress = inputElement.value;
		}

		receivingAccountAddressViewValue = inputElement.value;

		updateWeb3Props();
		autoResizeTextarea(inputElement);
		inputElement.checkValidity();
	}

	async function setTokenAmount(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		const inputElValue = inputElement.value.replace(/[+-]/g, '');
		receivingAmountViewValue = inputElValue;
		receivingAmount = ethers.parseEther(inputElValue);
		updateWeb3Props();
	}

	async function setTokenAmountMax() {
		receivingAmountViewValue = tokenAmount;
		receivingAmount = ethers.parseEther(tokenAmount.toString());
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
		if (sendingAmountInput) {
			formIsInValid = !(
				sendingAmountInput.checkValidity() &&
				ethers.isAddress(receivingAccountAddress) &&
				receivingAmountViewValue > 0
			);
		}
	}

	function autoResizeTextarea(textarea: any) {
		textarea.style.height = '1px';
		textarea.style.height = 5 + textarea.scrollHeight + 'px';
	}

	setTimeout(() => {
		const textarea = document.getElementById('sending-account');
		if (textarea) {
			textarea.addEventListener('input', function () {
				autoResizeTextarea(this);
			});
		}
	});

	function formatNumber(val: string) {
		if (Number.isInteger(parseFloat(val))) {
			return parseFloat(val).toFixed(2);
		} else {
			return val;
		}
	}
</script>

<div>
	{#if token}
		{#if subView === 'SEND'}
			<div id="token-container" class="primary-font-color">
				<div class="field-section flex">
					<div class="field-section-title" style="font-size: 24px;">Send ${token.symbol}</div>
					<img
						style="width: 19px; margin: 0px 0px 0px 7px;"
						alt="dai logo"
						src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/dai-logo.svg"
					/>
				</div>
				<div class="field-section mt-8">
					<div class="field-title">Recipient address</div>

					<textarea
						cols="1"
						class="tertiary-background-color"
						on:input={(event) => {
							if (timeout) clearTimeout(timeout);
							timeout = setTimeout(() => {
								setRecievingAddress(event);
							}, 600);
						}}
						bind:value={receivingAccountAddressViewValue}
						placeholder="Wallet address or ENS name"
						id="sending-account"
						maxlength="200"
					/>
					{#if loading === false && ensNameNotFound === false && receivingAccountAddressViewValue !== receivingAccountAddress}
						<div style="color: #3DBD00" class="field-title text-md flex items-center">
							<img
								style="margin-right: 10px; width: 20px; height: 20px"
								class="mr-4 rounded-full"
								alt="ens avatar"
								src={ensNameAvatarImage}
							/>
							<div style="font-size: 14px;">{previewAddr(receivingAccountAddress || '')}</div>
						</div>
					{/if}
					{#if loading === false && receivingAccountAddress && !ethers.isAddress(receivingAccountAddress)}
						<div class="input-error">Invalid Address.</div>
					{/if}
					{#if ensNameNotFound}
						<div class="input-error">Invalid Address.</div>
					{/if}
					<div class="flex justify-between mt-8">
						<div class="field-title">Amount</div>
						<!-- <button
							class="field-value-alt"
							style="text-decoration: underline;"
							on:click={(e) => {
								setTokenAmountMax();
							}}>Max</button
						> -->
					</div>
					<div class="icon-input">
						<input
							style="padding-right: 110px;"
							class="tertiary-background-color large"
							on:input={(event) => {
								if (timeout) clearTimeout(timeout);
								timeout = setTimeout(() => {
									setTokenAmount(event);
								}, 600);
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
							<img
								style="width: 19px; margin: 0px 7px 0 0;"
								alt="dai logo"
								src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/dai-logo.svg"
							/>
							<div style="color: #9ca3af; font-size: 18px">
								${token.symbol}
							</div>
						</span>
					</div>
					{#if receivingAmountViewValue && Number(receivingAmountViewValue) > Number(tokenAmount)}
						<div class="input-error">Not enough funds.</div>
					{/if}
					<p style="font-size: 16px; margin: 12px 0 48px 0">
						Your Balance <button
							style="border-bottom: 1px solid #0c162d"
							on:click={(e) => {
								setTokenAmountMax();
							}}
							>{tokenAmount
								? formatWithByDecimalPlaces(Number(tokenAmount), 2) + ' $' + token.symbol
								: '0.00'}</button
						>
					</p>
				</div>
			</div>
			<div class="field-section" style="width: 100%; position: fixed; bottom: 14px;">
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
				<div class="field-section-title" style="font-size: 18px; margin-left: 9px; margin-top: 4px">
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
					{#if receivingAccountAddressViewValue !== receivingAccountAddress}
						<div class="field-value-alt flex">
							<img
								style="margin-right: 10px; width: 20px; height: 20px"
								class="mr-4 rounded-full"
								alt="ens avatar"
								src={ensNameAvatarImage}
							/>{receivingAccountAddressViewValue} ({previewAddr(receivingAccountAddress || '')})
						</div>
					{/if}
					{#if receivingAccountAddressViewValue === receivingAccountAddress}
						<div class="field-value-alt">
							{receivingAccountAddressViewValue}
						</div>
					{/if}
				</div>
				<div class="field-container">
					<div class="field-title">Amount</div>
					<div class="field-value-alt">
						{receivingAmountViewValue
							? formatNumber(receivingAmountViewValue) + ' $' + token.symbol
							: '-'}
					</div>
				</div>
				<div class="field-container">
					<div class="field-title">Chain Id</div>
					<div class="field-value-alt">
						{token.chainId}
					</div>
				</div>
			</div>
			<div class="field-section" style="width: 100%; position: fixed; bottom: 14px;">
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
