<script lang="ts">
	import { onMount } from 'svelte';
	import context from '../lib/context';
	import { Token } from '../lib/types';
	import { metadataCache } from '../lib/storage';
	import { allowedChainsDiscovery } from '../lib/constants';

	export let tokenId: string;
	let token: Token;
	let contract: any;

	context.data.subscribe((value) => {
		if (value.token) token = value.token;
		contract = value.contract;
	});

	let src: string;

	onMount(async () => {
		if (tokenId == "admin"){
			if (!token.contractURI) return;
			try {
				const meta = await (
					await fetch(token.contractURI, {
						headers: {
							'Content-type': 'text/plain'
						}
					})
				).json();
				if (meta && meta.image) src = meta.image;
			} catch(e){}
			return;
		}
		try {
			src = $metadataCache[tokenId];
			
			if (src){
				return;
			}

			let chainName = allowedChainsDiscovery[token.chainId.toString()]
			if (chainName){
				try {
					const meta = await (
						await fetch(`https://api.token-discovery.tokenscript.org/get-token?chain=${chainName}&collectionAddress=${token.contractAddress}&tokenId=${tokenId}`, {
							headers: {
								'Content-type': 'text/plain'
							}
						})
					).json();
					if (meta && meta.image) src = meta.image;
				} catch(e){}
			}
				
			if (!src){
				let tokenUri = await contract['tokenURI'](tokenId);
				const meta = await (
					await fetch(tokenUri, {
						headers: {
							'Content-type': 'text/plain'
						}
					})
				).json();
				src = meta.image;
			}
			$metadataCache[tokenId] = src
		} catch (e) {
			console.log('failed to fetch image URL');
		}
	});
</script>

<div class="cat-list-image">
	<img
		alt="cat"
		src={src ||
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'}
	/>
</div>

<style>
	.cat-list-image img {
		width: 73px;
    	display: block;
	}
</style>
