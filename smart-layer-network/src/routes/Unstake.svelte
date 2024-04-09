<script lang="ts">
	import SlnLogo from '../components/SlnLogo.svelte';
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers } from 'ethers';
	import { getStakedData } from '../lib/utils';
	import type { ITokenContextData } from '@tokenscript/card-sdk/dist/types';
	let token: ITokenContextData;
	let loading = true;
	let stakingAmount: number | string = 0;
	let tokenAmount: number | undefined;
	let stakeAmount: undefined | number;
	let currentStakeAmountEther: any;
	let stakeReward: undefined | number;
	const stakeAddress = '0xE42185196640a4A2dfC668C19872958Db7AdaAC9';

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;

		// @ts-ignore
		tokenAmount = ethers.formatEther(token._count);

		const stakedData = await getStakedData(stakeAddress, token.ownerAddress);
		stakeAmount = stakedData.stakeAmount;
		currentStakeAmountEther = stakeAmount ? ethers.formatEther(stakeAmount) : 0;
		stakeReward = stakedData.stakeReward;

		// You can load other data before hiding the loader
		loading = false;
	});

	function applyMax() {
		if (stakeAmount) stakingAmount = ethers.formatEther(stakeAmount);
	}

	function setTransactionParams(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		stakingAmount = inputElement.value;
		if (stakingAmount) {
			web3.action.setProps({
				stakeAmount: ethers.parseEther(stakingAmount.toString()),
				stakeReward: stakeReward?.toString()
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
					<p style="text-align: center;">Unstake Tokens</p>
				</div>
			</div>
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
						{stakeAmount ? ethers.formatEther(stakeAmount) + ' SLN' : '-'}
					</div>
				</div>
			</div>
			<div class="field-section">
				<div class="flex-between field-section-heading">
					<div class="field-section-title">Unstake Amount</div>
					{#if currentStakeAmountEther > 0}
						<button
							on:click={(e) => {
								applyMax();
							}}
							class="no-button-style field-value">MAX</button
						>
					{/if}
				</div>
				<input
					on:change={(event) => {
						setTransactionParams(event);
					}}
					type="number"
					placeholder=""
					id="stake-amount"
					style="padding: 12px 14px;width: 100%;border-radius: 4px;border: 1px solid #B6B6BF;border-radius: 14px;margin: 5px 0;"
					value={stakingAmount}
				/>
			</div>
			<div class="field-section">
				{#if Number(stakingAmount) > 0}
					<div class="flex-between field-section-heading">
						<div class="field-section-title">Summary</div>
					</div>
					<div class="field-container">
						<div class="field-title">To Unstake</div>
						<div class="field-value">{stakingAmount} SLN</div>
					</div>
					<div class="field-container">
						<div class="field-title">Reward</div>
						<div class="field-value">
							{stakeReward ? ethers.formatEther(stakeReward) : 0} SLN
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
