<script lang="ts">
	import Arbitrum from '../components/Arbitrum.svelte';
	import Linea from '../components/Linea.svelte';
	import Base from '../components/Base.svelte';
	import Scroll from '../components/Scroll.svelte';
	import Polygon from '../components/Polygon.svelte';
	import Optimism from '../components/Optimism.svelte';
	import PortalBridge from '../components/PortalBridge.svelte';

	export let web3LogoRef: string;
</script>

{#if web3LogoRef === 'Arbitrum'}
	<Arbitrum />
{/if}
{#if web3LogoRef === 'PortalBridge'}
	<PortalBridge />
{/if}
{#if web3LogoRef === 'Optimism'}
	<Optimism />
{/if}
{#if web3LogoRef === 'Polygon'}
	<Polygon />
{/if}
{#if web3LogoRef === 'Linea'}
	<Linea />
{/if}
{#if web3LogoRef === 'Base'}
	<Base />
{/if}
{#if web3LogoRef === 'Scroll'}
	<Scroll />
{/if}
