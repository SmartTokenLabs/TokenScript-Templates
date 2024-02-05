<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';

	let token;
	let loading = true;

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;
	});
</script>

<div class="page">
	{#if token}
		<div>
			<div class="header">
				<img
					style="width: 164px;"
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAegAAAA8CAYAAACtiCmBAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVcSURBVHgB7d3hcRtFGMbxRx4KCA2Q0/CdyVAAUSgAmwaApAAMaSBOCkhwA4lMAzgV2K4AUgCRKsBKAWR53+hmcGDs3N6u7nYv/9/MjjITjU9a3e2j29vTqxDCMkzTT8rE/lZj7TLUaWXtlipmr39m7Vno722I2B/a7Z2F/qK2VyJ7/d4+bfefqXltbRHZF/OQNgb4NpvIbX4b6h13ruP9cGfgfvBtRo2B4d/PfBX6yTIG7Fn7XtO0r3wW1moNuUb1vvarUnb2mbUfuzzRD0xt+2uh/nx736h+PpA2mp654j9fHydTjqMmcpu+D+1rGsfuVd73BxHPz9EPjbb7cqyF+u//WcaAPQH4r6kNigAqREADAFAgAhoAgAIR0AAAFIiABgCgQAQ0AAAFIqABACgQAQ0AQIEIaAAACkRAAwBQIAIaAIACEdAAABSIgAZwnY0AjOYToYtTbavZNKrPyWw2WwuIlyOg1yrPytpScU6s3VX/McC3ea5hbVTel6w+ff/RyhHQ9y0AlsoshLBUIaUw7f35Tn5PAGIEO3bmqpy9B3/wYKltDDi2134kVIspbgAACkRAAwBQIK5BAwAwEruce+3/EdB4j+0sC5W3GG6m+sytL39QWTZ2TfJUiNYOogv1PzbW1vfnwhh8/Diwz7BRnLtK02UMuG5s8x3ugoBuWUce2sMd1eWNtaN2EVuyNpzPhBwaay9UFvuIgy/qPBE6a8P5vrXn6s/7/mtCejSHGl6jtDFgRUDr3ZHjwfyL6vSH8t220AhT5t/Wq19VPZLbStcI6K7JEdAvLOBKO1OIdUsAABSEVdwAABSIgAYAoEAENAAABSKgAQAoEAENAECBCGgAAApEQAMAUCACGgCAAhHQAAAUiIAGAKBABDSuqrFqFABMEsUy6nepDG6qSRr7p7QbfHkA0NeuxqUPSRq3COgtrwi1Un3VZrzM5CuVw78sPNRu1FaQxaujvVF++6qvLCowJg/nJ9bWGpYXYXqmBAS08XrKdgb5peqrarXJVQs6E389S2Vmn41/C60poH1AOLa+WCujth8aEdBArPMha3G3M5Je2nX0gO4ydZBzerLrVMWFIrRBV1LYAQA+YjkWiT2wcNu7qWk73ZeDB+jnH9pe244EAEClhlrF/Vjba7ypfAr6acYFTQAAFGmQgG6njx8ojwNr9wQAwIQNdh90e4E+11T3c86iAQBTNvQqbp/q9ttE5krTWDuykD6y4NeutV8Gar4PNwzRT+82tF1pnFuNfT/bQV/MxP3giLCj4zGHwcakmg36S2KZp7oPlR70XTXW/rL2tsL2WsPdPjaXdvIe/lZdfOTxft9FP3wnoJtHGm/cuan9qfpuaR3F4D/1mXGqe8gFYwvVu0PdFgcDgHI0YkzqZKzf4s61qpsFYwCASRoloDNPdbNgDAAwOaNVs8o41d1ou2BMAABMxajlJi2kf7aH35VuyAVjAADsXAn1oHNMdfMLYwCASRk9oO0s2ks9PlY6FowBACajhDNotYUtckx1s2AMADAJRQR0y6e6U9O1EQvGAAATUExAt1PdD5WOBWMAgOqVdAbtIe23XZ0pjS8YY6obAFC1ogK65VPdl0qzaBsAAFUqLqDtLHptD0+U7pEAAKhUjoBOPdv9n0xT3Y0Qa8rXBTY7em5Ngob9jLnO9D76Yzw19n3wetB+D/JX6scHslfaDZ/qfqrt/c0bxQ+avyqfU9Vb5u+inZXo4qW13zTNSjMvuzzJa9SGEPxLZ8pxUSo/hk66PLHth7X989jaF+qnU59XYqm0/cH7/iLi+R4ofqLymaYnZkzK0Q8b215M3yfLdfz8AyZaR3Km6sHKAAAAAElFTkSuQmCC"
					alt="logo"
				/>
			</div>
			<div class="profile-banner">
				<div class="profile-banner-effect-mask">
					<div class="profile-banner-effect" />
				</div>
				<img
					alt="profile"
					class="profile-img"
					src="https://store.redbrick.land/prod/avatar/preset/rpm/thumbnail/rpm_001.png"
				/>
				<img
					alt="banner"
					style="width: 100%; display: block"
					src="https://redbrick.land/static/media/default_banner.0c8352022deaa6edacb3.jpg"
				/>
				<p class="page-name alt-colour">Points</p>
			</div>
			<div class="content-panel no-bg">
				<h1>technic.eth</h1>
				<div class="stats">
					<div><span>0</span> <span class="secondary-text-colour">Items</span></div>
					<div><span>0</span> <span class="secondary-text-colour">Friends</span></div>
					<div><span>0</span> <span class="secondary-text-colour">Worlds</span></div>
					<div><span>0</span> <span class="secondary-text-colour">Projects</span></div>
				</div>
			</div>
			<div class="content-panel">
				<div class="content points-container">
					<div>
					<div style="margin-bottom: 7px" class="secondary-text-colour">My Point</div>
					<div class="text-large">20 P</div>
					</div>
					<img alt="points" src="https://redbrick.land/static/media/ic_point.9d588b08c5e1c8e145091827ca704b7c.svg">
				</div>
			</div>
			<div class="content-panel no-bg"></div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
