<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";
	import { decimalToHex, hexToAscii, santitiseEnsName } from "../lib/utils";
	import { namehash } from "ethers";
	import { getEnsContract } from '../lib/abi';
	import Header from "../components/Header.svelte";

	const ensContract = getEnsContract();

	let renewalSeconds: bigint;
	let token:any;
	let loading = true;
	let years = 1;
	let renewalPriceUSD: number | undefined;
	const maxYears: number = 10;
	let ensDisplayName: string | undefined = 'loading...';
	let ensBaseName = '';
	let isEnsSubName = false;

	context.data.subscribe(async (value) => {
		if (!value.token)
			return;
		token = value.token;

		init()

		// You can load other data before hiding the loader
		loading = false;
	});

	// Yearly renewals cost $5/year for names that are 5 characters or longer.
	// 4 character names cost $160/year, and 3 character names cost $640/year.
	// Fees are paid in ETH. The ETH/USD exchange rate is set by the Chainlink ETH/USD oracle.
	function setEnsNameRenewalPrice () {
		let price;
		if(!ensDisplayName) return;
		const ensNameLength = ensDisplayName?.length;
		if(ensNameLength < 4) price = years * 640;
		else if(ensNameLength === 4) price = years * 160;
		else price = years * 5;
		renewalPriceUSD = price;
		renewalSeconds = BigInt(years) * BigInt(31536000);
		// @ts-ignore
		web3.action.setProps({ renewalSeconds: renewalSeconds.toString() });
	}

	function dateToUIDate(dateValue:number):string {
		if(!dateValue) return 'Could not be found';
		const userLocale = navigator.language;
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		const milliseconds = Number(dateValue) * 1000;
		return new Date(milliseconds).toLocaleDateString(userLocale, options as Intl.DateTimeFormatOptions);
	}

	async function setTokenData () {
		const hash = namehash(ensBaseName);
		const tokenDataRes = await ensContract.getData(hash);
		// @ts-ignore
		web3.action.setProps({ baseENSTokenId: hash });
		applyValueIfNotExist('owner', tokenDataRes[0])
		applyValueIfNotExist('expiry', dateToUIDate(tokenDataRes[2]))
	}

	async function getEnsName() {
		try {
			const tokenIdToHex = decimalToHex(token.tokenId);
			const rawENSName = await ensContract.names(tokenIdToHex);
			const rawNameToAscii = hexToAscii(rawENSName);
			const { baseName, subName } = santitiseEnsName(rawNameToAscii);
			ensDisplayName = subName ? subName : baseName;
			ensBaseName = baseName;
			isEnsSubName = !!subName;
			await setTokenData();
		} catch (error) {
			ensDisplayName = 'not found';
			console.log('error', error);
		}
	}

	function applyValueIfNotExist (tokenKey:string, tokenValue:any) {
		if(token[tokenKey]) return;
		token[tokenKey] = tokenValue;
	}

	function updateYearsSelected (increment: boolean) {
		if(increment && years < maxYears) {
			years ++;
		} else if(!increment && years > 1) {
			years --;
		}
		setEnsNameRenewalPrice();
	}

	async function init() {
		await getEnsName();
		setEnsNameRenewalPrice();
	}

</script>

<div>
	{#if token}
		<Header name={ensDisplayName} expiry={token.expiry} image={token.image_preview_url} />
		<div style="margin: 14px 0; background-color: white; border-radius: 7px; border: solid #C2C2C2 1px; width: 100%; display: flex; justify-content: space-between; flex-direction: column;">
			<div style="width: 100%;">
					<p style="
						font-size: 19px;
						font-weight: 500;
						text-align: center;
						">Renew</p>
			</div>

			<div style="margin: 24px; background-color: #F5F5F5; border-radius: 20px; font-weight: 300; padding: 24px;">
				<div style="height: 69px; border-radius: 60px; display: flex; justify-content: space-between; align-items: center; background-color: white; border: solid #C2C2C2 1px;">
					<button class="years-selection-btn" on:click={() => { updateYearsSelected(false)}} style="background-color: #C2C2C2; border-radius: 38px; height: 58px; width: 58px; margin: 5px; text-align: center; border: none; cursor: pointer;">-</button>
					<div style="
							font-weight: 500;
							">{years > 1 ? years + ' Years' : years + ' Year' }</div>
					<button class="years-selection-btn" on:click={() => { updateYearsSelected(true)}} style="background-color: #3888FF; border-radius: 38px; color: white; height: 58px;width: 58px; margin: 5px; text-align: center; cursor: pointer; border: none;">+</button>
				</div>
			</div>

			<div style="margin: 24px; background-color: #F5F5F5; border-radius: 20px; font-weight: 300; padding: 24px;">
					<div style="background-color: #F5F5F5; border-radius: 20px; padding: 0px 9px;">

							<p style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;">
								Extension (Years)
							</p>
							<p style="font-size: 14px; color: black; word-wrap: break-word;">
								{years > 1 ? years + ' years' : years +' year' } extension
							</p>
							<p style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;">
								Price (USD)
							</p>
							<p style="font-size: 14px; color: black; word-wrap: break-word;">
								{renewalPriceUSD ? '$'+renewalPriceUSD : 'loading...'}
							</p>

							<p style="color: #9A9A9A; font-weight: 300;">
							<small> { isEnsSubName ? `Note: this function will renew the expiry of ${ensBaseName}.` : '' }</small>
						</p>
					</div>
			</div>
		</div>
	{/if}
	<Loader show={loading}/>
</div>

