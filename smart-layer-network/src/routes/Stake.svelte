<script lang="ts">
	import SlnLogo from '../components/SlnLogo.svelte';
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import { getStakedData, getApprovedStakeAllowance } from './../lib/utils';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	let token: ITokenContextData;
	let loading = true;
	let stakingAmount: number | string = 0;
	let tokenAmount: number | undefined;
	let currentStakedAmount: any;
	let currentStakeAmountEther: any;
	let stakeAllowance: { ether: number | undefined; wei: number | undefined } = {
		ether: undefined,
		wei: undefined
	};
	const stakeAddress = '0xE42185196640a4A2dfC668C19872958Db7AdaAC9';

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;

		// @ts-ignore
		tokenAmount = ethers.formatEther(token._count);

		const stakedData = await getStakedData(stakeAddress, token.ownerAddress);

		currentStakedAmount = stakedData.stakeAmount;

		currentStakeAmountEther = currentStakedAmount ? ethers.formatEther(currentStakedAmount) : 0;

		stakeAllowance = await getApprovedStakeAllowance(
			// @ts-ignore
			token?.contractAddress,
			stakeAddress,
			token.ownerAddress
		);

		// You can load other data before hiding the loader
		loading = false;
	});

	function applyMax() {
		// @ts-ignore
		stakingAmount = stakeAllowance.ether ?? 0;
	}

	function setTransactionParams(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		stakingAmount = inputElement.value;
		if (stakingAmount) {
			web3.action.setProps({
				stakeAmount: ethers.parseEther(stakingAmount)
			});
		}
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
					<p style="text-align: center;">Stake Tokens</p>
				</div>
			</div>

			{#if stakeAllowance.ether && stakeAllowance.ether === 0}
				<div class="field-section">
					<div class="field-section-title">Action required</div>
					<div class="field-section-value">
						<p>
							The approved staking token balance of SLN is 0. Please navigate to the approve staking
							amount section to update the balance (minimum of 10 SLN required to stake).
						</p>
					</div>
				</div>
			{/if}

			{#if stakeAllowance.ether && stakeAllowance.ether > 0}
				<div class="field-section">
					<div class="flex-between field-section-heading">
						<div class="field-section-title">Unstaked Token Balance</div>
					</div>
					<div class="field-container">
						<div class="field-value">{tokenAmount + ' SLN' ?? '-'}</div>
					</div>
				</div>
				<div class="field-section">
					<div class="flex-between field-section-heading">
						<div class="field-section-title">Staked Token Balance</div>
					</div>
					<div class="field-container">
						<div class="field-value">
							{currentStakedAmount ? ethers.formatEther(currentStakedAmount) + ' SLN' : '-'}
						</div>
					</div>
				</div>

				<div class="field-section">
					<div class="flex-between field-section-heading">
						<div class="field-section-title">Stake Amount</div>
						<button
							on:click={(e) => {
								applyMax();
							}}
							class="no-button-style field-value max-button">MAX</button
						>
					</div>
					<input
						on:change={(event) => {
							setTransactionParams(event);
						}}
						type="string"
						minlength="2"
						placeholder=""
						id="stake-amount"
						style="padding: 12px 14px;width: 100%;border-radius: 4px;border: 1px solid #B6B6BF;border-radius: 14px;margin: 5px 0;"
						value={stakingAmount}
					/>
					{#if Number(currentStakeAmountEther) + Number(stakingAmount) > 0 && Number(currentStakeAmountEther) + Number(stakingAmount) < 10}
						<div style="color: red; padding: 12px 0;">
							A minimum of 10 SLN is required to stake.
						</div>
					{/if}
				</div>

				<div class="field-section">
					{#if Number(stakingAmount) > 0 && !(Number(currentStakeAmountEther) + Number(stakingAmount) > 0 && Number(currentStakeAmountEther) + Number(stakingAmount) < 10)}
						<div class="flex-between field-section-heading">
							<div class="field-section-title">Summary</div>
						</div>
						<div class="field-container">
							<div class="field-title">Stake</div>
							<div class="field-value">{stakingAmount} SLN</div>
						</div>
						<div class="field-container">
							<div class="field-title">Reward Rate</div>
							<div class="field-value">0.001 SLN per hour per 1 SLN</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
	<Loader show={loading} />
</div>
