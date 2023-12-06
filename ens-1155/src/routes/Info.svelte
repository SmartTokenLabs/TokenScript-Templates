
<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";
	import { decimalToHex, hexToAscii, santitiseEnsName } from "../lib/utils";
	import {namehash} from "ethers";
	import {getEnsContract} from "../lib/abi";
	import Header from "../components/Header.svelte";

	const ensContract = getEnsContract();

	let token:any;
	let loading = true;
	let ensDisplayName: string | undefined;
	let ensBaseName = '';

	context.data.subscribe(async (value) => {
		if (!value.token)
			return;
		token = value.token;

		init()

		// You can load other data before hiding the loader
		loading = false;
	});

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

	async function init() {
		await getEnsName();
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
						">Info</p>
			</div>
			<div style="margin: 24px; background-color: #F5F5F5; border-radius: 20px; font-weight: 300; padding: 24px;">
					<div style="background-color: #F5F5F5; border-radius: 20px; padding: 0px 9px;">

						<p style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;">Status </p>
						<p style="font-size: 14px; color: black; word-wrap: break-word;">{ ensDisplayName ? "Set Correctly ✅" : "Not Set" }</p>

						{#if token.contractAddress}
							<p style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;">Contract</p>
							<div style="font-size: 14px; color: rgb(136, 136, 136); word-wrap: break-word;">
								<div style="font-size: 14px; color:black; word-wrap: break-word;">{token.contractAddress}
									<a href="https://etherscan.io/address/{token.contractAddress}" target="_blank">
										<svg style="width: 18px; position: relative; top: 4px; left: 2px;" width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/">
												<g transform="matrix(2.56187,0,0,2.56187,-3302.82,-4886.51)">
														<path d="M1308.92,1911.91L1308.92,1914.41L1300.89,1914.41C1297.78,1914.41 1295.26,1916.93 1295.26,1920.04C1295.26,1920.04 1295.26,1933.79 1295.26,1933.79C1295.26,1936.9 1297.78,1939.42 1300.89,1939.42C1300.89,1939.42 1316.59,1939.42 1316.59,1939.42C1319.7,1939.42 1322.22,1936.9 1322.22,1933.79L1322.22,1928.52L1324.72,1928.52L1324.72,1933.79C1324.72,1938.28 1321.08,1941.92 1316.59,1941.92L1300.89,1941.92C1296.4,1941.92 1292.76,1938.28 1292.76,1933.79L1292.76,1920.04C1292.76,1915.56 1296.4,1911.91 1300.89,1911.91L1308.92,1911.91ZM1324.52,1913.16L1323.27,1911.91L1313.75,1911.91L1313.75,1914.41L1320.26,1914.41L1308.04,1926.63L1309.8,1928.4L1322.04,1916.17C1322.04,1916.17 1322.07,1923.54 1322.07,1923.54L1324.57,1923.53L1324.52,1913.16Z"/>
												</g>
										</svg>
									</a>
								</div>
							</div>
						{/if}
						{#if token.description}
							<p style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;">Description </p>
							<p style="font-size: 14px; color: black; word-wrap: break-word;">{token.description}</p>
						{/if}
						{#if token.tokenInfo.type}
							<p style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;">Token Standard </p>
							<p style="font-size: 14px; color: black; word-wrap: break-word;">{token.tokenInfo.type}</p>
						{/if}
						{#if token.tokenId}
							<p style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;">Token Id </p>
							<p style="font-size: 14px; color: black; word-wrap: break-word;">{token.tokenId}</p>
						{/if}
						{#if token.chainId}
							<p style="font-size: 14px; color: rgb(136, 136, 136); font-weight: 400;">Chain</p>
							<p style="font-size: 14px; color: black; word-wrap: break-word; word-wrap: break-word;">{token.chainId}</p>
						{/if}
					</div>
			</div>
		</div>
	{/if}
	<Loader show={loading}/>
</div>
