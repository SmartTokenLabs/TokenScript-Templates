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
				<p class="page-name alt-colour">Profile</p>
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
				<p class="title">Referral Code</p>
				<div class="content">
					<div>
						<input value="Dy34s" disabled class="share-input" />
						<button class="share-btn">Share</button>
					</div>
					<p class="content-panel-text">
						<span>0</span>
						<span class="secondary-text-colour">Signed up with your referral code</span>
					</p>
				</div>
			</div>
			<div class="content-panel">
				<div class="title-with-headline">
					<p class="title">My Level</p>
					<div class="title-right secondary-text-colour content-panel-text">Reward/Level System</div>
				</div>
				<div class="content">
					<div class="badge-container">
						<img
							alt="badge"
							src="https://redbrick.land/static/media/badge_level_0.950d2cd6adb154ae7bfd.svg"
						/>
						<p>Unranked</p>
					</div>
					<div class="xp-bar-container">
						<div style="width: 30%" class="xp-bar-value"></div>
					</div>
					<div class="content-panel-text">
						<p style="text-align:center"><span>50xp</span> <span class="secondary-text-colour">remaining until</span> <span>Level 1</span></p>
					</div>
				</div>
			</div>
			<div class="content-panel">
				<p class="title">Avatar</p>
				<div class="content avatar-container">
					<img
						alt="avatar"
						src="https://store.redbrick.land/prod/avatar/preset/rpm/thumbnail/rpm_001.png"
					/>
				</div>
			</div>
			<div class="content-panel">
				<p class="title">Link</p>
				<div class="content">
					<div class="link-account-container">	
						<a href="" target="_blank"><img alt="eth logo" src="https://redbrick.land/static/media/ic_eth.cdfa51a64b652e00121cb6c577f8c35b.svg" /></a>
						<a href="" target="_blank"><img alt="bsc logo" src="https://redbrick.land/static/media/ic_bsc_disabled.0cbb1fec39bb5234dc1edbc4d8ea3172.svg" /></a>
						<a href="" target="_blank"><img alt="polygon logo" src="https://redbrick.land/static/media/ic_polygon_disabled.9fd01cd4dfefe0c786c2a74d9ce02cdc.svg" /></a>
						<a href="" target="_blank"><img alt="arbitrum logo" src="https://redbrick.land/static/media/ic_arbitrum_disabled.f81ef425498243c5320df263d0b30b17.svg" /></a>
						<a href="" target="_blank"><img alt="optimism logo" src="https://redbrick.land/static/media/ic_optimism_disabled.470c30244bde91ddfd8ee1f68729e067.svg" /></a>
						<a href="" target="_blank"><img alt="avalanche logo" src="https://redbrick.land/static/media/ic_avalanche_disabled.217037805532713f692dbf554a874db7.svg" /></a>
						<a href="" target="_blank"><img alt="klayton logo" src="https://redbrick.land/static/media/ic_klaytn_disabled.d48ceb9b7da489bf35d8cca4e707bcc5.svg" /></a>
						<a href="" target="_blank"><img alt="ic logo" src="https://redbrick.land/static/media/ic_endurance_disable.b2734d8a11dcff1fd688ce7c893ab6c1.svg" /></a>
						<a href="" target="_blank"><img alt="discord logo" src="https://redbrick.land/static/media/ic_discord_disabled.a3d85528efdbcd6cab8ef597050cb7b3.svg" /></a>
						<a href="" target="_blank"><img alt="x logo" src="https://redbrick.land/static/media/ic_twitter_disabled.924cafb9609e445e5aaabcbebba312fa.svg" /></a>
						<a href="" target="_blank"><img alt="x logo" src="https://redbrick.land/static/media/ic_twitter_disabled.924cafb9609e445e5aaabcbebba312fa.svg" /></a>
						<a href="" target="_blank"><img alt="telegram logo" src="https://redbrick.land/static/media/ic_telegram_disabled.05eb1ad51b0096f19096100031e10165.svg" /></a>
						<a href="" target="_blank"><img alt="facebook logo" src="https://redbrick.land/static/media/ic_fb_disabled.bcbbadd5e7b72246131354b6ef0986ec.svg" /></a>
					</div>
				</div>
			</div>
			<div class="content-panel no-bg"></div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
