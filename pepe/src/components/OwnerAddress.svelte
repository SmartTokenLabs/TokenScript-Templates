<script lang="ts">
	import { onMount } from 'svelte';
	import { lookupEnsName } from '../lib/data';
	import { TokenCardTypes } from '../lib/types';
	export let address: string;
	export let accountType = TokenCardTypes.Friends

	let ensName: string;

	onMount(async () => {
		const ensRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+eth$/
		if (ensRegex.test(address)){
			ensName = await lookupEnsName(address);
		}
	});
</script>

<div class="eth-address" title={address}>
	<span>{ensName ? `${ensName} (${address || ''})` : address}</span>
</div>

<style>
	.eth-address {
		cursor: pointer;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 100%;
		display: block;
		font-size: 14px;
	}
	.fw600 {
		font-weight: 600;
	}
</style>
