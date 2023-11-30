<script lang="ts">
	import { onMount } from 'svelte';
	import context from '../lib/context';
	import {Token} from '../lib/types';

	export let tokenId: string;
	let token: Token;
	let contract: any;

	context.data.subscribe((value) => {
		if (value.token)
			token = value.token;
		contract = value.contract;
	});

	let src: string;

	onMount(async () => {
		try {
			let tokenUri = await contract['tokenURI'](tokenId);
			console.log({ tokenUri });
			const meta = await (
				await fetch(tokenUri, {
					headers: {
						'Content-type': 'text/plain'
					}
				})
			).json();

			src = meta.image;
			console.log({ image: src });
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
		width: 64px;
	}
</style>
