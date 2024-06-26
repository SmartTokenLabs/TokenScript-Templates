<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	import { formatWithByDecimalPlaces, previewAddr, fetchENSImage } from '../lib/utils';

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

		// @ts-ignore
		if (token._count && Number(ethers.formatEther(token._count)) > 0.000000000000000001) {
			tokenAmount = ethers.formatEther(token._count);
		}

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
			<div id="token-container" class="text-white">
				<div class="field-section">
					<div class="field-section-title neue-plak" style="font-size: 24px;">Send $SLN</div>
				</div>
				<div class="field-section">
					<div class="flex justify-between">
						<div class="field-title">Amount</div>
					</div>
					<div class="icon-input">
						<input
							style="padding-right: 110px;"
							class="neue-plak large"
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
							<div
								style="align-items: center; height: 24px; width: 24px; padding: 1.5px 0 0 1.5px; margin-right: 9px; margin-top:2px"
							>
								<img
									style="border-radius: 24px;"
									src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/sln/sln-logo-5.svg"
									alt="sln logo"
								/>
							</div>
							<div style="font-size: 20px;">$SLN</div>
						</span>
					</div>
					{#if receivingAmountViewValue && Number(receivingAmountViewValue) > Number(tokenAmount)}
						<div class="input-error">Not enough funds.</div>
					{/if}
					<p style="font-size: 16px; margin: 12px 0 48px 0">
						Your Balance <button
							style="border-bottom: 1px solid #fff"
							on:click={(e) => {
								setTokenAmountMax();
							}}
							>{tokenAmount
								? formatWithByDecimalPlaces(Number(tokenAmount), 2) + ' $' + token.symbol
								: '0.00'}</button
						>
					</p>
					<div class="field-title">Recipient address</div>

					<textarea
						cols="1"
						class="neue-plak"
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
						{receivingAmountViewValue ? formatNumber(receivingAmountViewValue) + ' $SLN' : '-'}
					</div>
				</div>
				<div class="field-container">
					<div class="field-title">Chain</div>
					{#if token.chainId === 1}
						<div class="field-value-alt flex">
							<div style="margin-right: 7px; margin-top: 4.5px;" class="text-md font-semibold">
								Ethereum Mainnet
							</div>
							<img
								style="height: 24px;"
								alt="chain"
								src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/ethereum.svg"
							/>
						</div>
					{/if}
					{#if token.chainId === 137}
						<div class="field-value-alt flex">
							<div style="margin-right: 7px; margin-top: 4.5px;" class="text-md font-semibold">
								Polygon
							</div>
							<img
								style="height: 24px"
								alt="chain"
								src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/Polygon.svg"
							/>
						</div>
					{/if}
					{#if token.chainId === 8217}
						<div class="field-value-alt flex">
							<div style="margin-right: 7px; margin-top: 4.5px;" class="text-md font-semibold">
								Klaytn
							</div>
							<img
								style="height: 24px"
								alt="chain"
								src="https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/klaytn-symbol.svg"
							/>
						</div>
					{/if}
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
