
<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";

	let token: {
		resolverAddress:string;
		nameExpires:number;
		name:string;
		ensName:string;
		description:string;
		image_preview_url?: string;
		renewalPricePerYear: number;
		avatar?: string;
		email?: string;
		keywords?: string;
		phone?: string;
		url?: string;
		display?: string;
		notice?: string;
		location?: string;
	};
	let expiry:string;
	let loading = true;
	let resolvedENS:Boolean;

	context.data.subscribe(async (value) => {
		if (!value.token) return;

		token = value.token;
		expiry = dateToUIDate(token.nameExpires * 1000);

		init();

		// You can load other data before hiding the loader
		loading = false;
	});

	function dateToUIDate(dateValue:number):string {
		if(!dateValue) return 'Could not be found';
		const userLocale = navigator.language;
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		return new Date(dateValue).toLocaleDateString(userLocale, options as Intl.DateTimeFormatOptions);
	}

	function resolvedText() {
		resolvedENS = parseInt(token.resolverAddress, 16) !== 0;
	}

	function init() {
		resolvedText();
	}

</script>

<div>
	{#if token}
		<div style="margin: 14px 0; display: flex; justify-content: space-between; align-items: center; background-color: white; border-radius: 7px; border: 1px solid rgb(194, 194, 194); height: 142px; width: 100%;">
			<div style="margin: 15px;">
					<h3 style="font-size: 24px;">{token.name}</h3>
					<div style="padding: 0 14px; height: 29px; background-color: #E7F3EF; border-radius: 60px; display: flex; justify-content: center; align-items: center;">
						<div style="color: #1FB184; font-size: 12px;">Valid until: {expiry}</div>
					</div>
			</div>
			<div>
				<img style="width: 104px; margin-top: 4px; margin-right: 15px;" src="{token.image_preview_url}" alt={'image of ' + token.description} />
			</div>
		</div>
		<div style="margin: 14px 0; background-color: white; border-radius: 7px; border: solid #C2C2C2 1px; width: 100%; display: flex; justify-content: space-between; flex-direction: column;">
			<div style="width: 100%;">
					<p style="
						font-size: 19px;
						font-weight: 500;
						text-align: center;
						">Resolver</p>
			</div>
			<div style="display: flex; flex-direction: column; align-items: center;">
					<div style="background-color: #F5F5F5; width: 310px; border-radius: 20px; margin: 52px; padding: 24px;">
						<p style="color: #9A9A9A; font-weight: 600;">Status </p>
						<p style="color: #9A9A9A;">{ resolvedENS ? "Set Correctly ✅" : "Not Set" } </p>
						<p style="color: #9A9A9A; font-weight: 600;">Address </p>
						<p style="color: #9A9A9A; word-wrap: break-word;">{token.resolverAddress}</p>
						<p style="color: #9A9A9A; font-weight: 600;">Description </p>
						<p style="color: #9A9A9A; word-wrap: break-word;">{token.description ?? "N/A"}</p>
					</div>
			</div>
		</div>
	{/if}
	<Loader show={loading}/>
</div>
