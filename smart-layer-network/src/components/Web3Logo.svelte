<script lang="ts">
	import Arbitrum from '../components/Arbitrum.svelte';
	import Linea from '../components/Linea.svelte';
	import Base from '../components/Base.svelte';
	import Scroll from '../components/Scroll.svelte';
	import Polygon from '../components/Polygon.svelte';
	import Optimism from '../components/Optimism.svelte';
	import PortalBridge from '../components/PortalBridge.svelte';
	import BitTrue from '../components/BitTrue.svelte';
	import CoinOn from '../components/CoinOn.svelte';
	import OKX from '../components/OKX.svelte';
	import CryptoCOM from '../components/CryptoCOM.svelte';
	import DragonSwap from '../components/DragonSwap.svelte';
	import UniSwap from '../components/UniSwap.svelte';

	export let web3LogoRef: string;
</script>

{#if web3LogoRef === 'BitTrue'}
	<BitTrue />
{/if}
{#if web3LogoRef === 'DragonSwap'}
	<DragonSwap />
{/if}
{#if web3LogoRef === 'UniSwap'}
	<UniSwap />
{/if}
{#if web3LogoRef === 'CoinOn'}
	<CoinOn />
{/if}
{#if web3LogoRef === 'OKX'}
	<OKX />
{/if}
{#if web3LogoRef === 'CryptoCOM'}
	<CryptoCOM />
{/if}
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
