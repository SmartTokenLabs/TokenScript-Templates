<script lang="ts">
	import { onMount } from 'svelte';
	import { lookupEnsName } from '../lib/data';

	export let address: string;

	let ensName: string;

	onMount(async () => {
		const name = await lookupEnsName(address);
		if (name) ensName = name;
	});
</script>

<small class="eth-address" title={address}
	>Owner: <span>{ensName ? `${ensName} (${address})` : address}</span></small
>

<style>
	.eth-address {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 100%;
		display: block;
	}
</style>
