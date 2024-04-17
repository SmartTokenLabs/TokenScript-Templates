<script lang="ts">
	import Arbitrum from '../components/Arbitrum.svelte';
	import Linea from '../components/Linea.svelte';
	import Base from '../components/Base.svelte';
	import Scroll from '../components/Scroll.svelte';
	import Polygon from '../components/Polygon.svelte';
	import Optimism from '../components/Optimism.svelte';
	import PortalBridge from '../components/PortalBridge.svelte';
	import BitTrue from '../components/BitTrue.svelte';
	import CoinOne from './CoinOne.svelte';
	import OKX from '../components/OKX.svelte';
	import CryptoCOM from '../components/CryptoCOM.svelte';
	import DragonSwap from '../components/DragonSwap.svelte';
	import UniSwap from '../components/UniSwap.svelte';
	import GateIO from '../components/GateIO.svelte';
	import Kucoin from '../components/Kucoin.svelte';
	import ZkSync from './ZkSync.svelte';

	export let web3LogoRef: string;
</script>

{#if web3LogoRef === 'GateIO'}
	<GateIO />
{/if}
{#if web3LogoRef === 'ZkSync'}
	<ZkSync />
{/if}
{#if web3LogoRef === 'Kucoin'}
	<Kucoin />
{/if}
{#if web3LogoRef === 'BitTrue'}
	<BitTrue />
{/if}
{#if web3LogoRef === 'DragonSwap'}
	<DragonSwap />
{/if}
{#if web3LogoRef === 'UniSwap'}
	<UniSwap />
{/if}
{#if web3LogoRef === 'CoinOne'}
	<CoinOne />
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
