<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";
	import {getEnsContract} from '../lib/abi';
	import {TokenInterface} from "../lib/tokenTypes";
	import Header from "../components/Header.svelte";

	let selectedRecord = { title: "Avatar", contractKey: "avatar" };

	const renewOptions = {
		"Avatar": { title: "Avatar", contractKey: "avatar" },
		"Email": { title: "Email", contractKey: "email" },
		"Description": { title: "Description", contractKey: "description" },
		"Keywords": { title: "Keywords", contractKey: "keywords" },
		"Phone": { title: "Phone", contractKey: "phone" },
		"Url": { title: "Url", contractKey: "url" },
		"Display": { title: "Display", contractKey: "display" },
		"Notice": { title: "Notice", contractKey: "notice" },
		"Location": { title: "Location", contractKey: "location" }
	}

	interface RenewOptionsInterface {
  		[key: string]: { title: string, contractKey: string }
	}

	function getRenewOption(renewOptions: RenewOptionsInterface, renewOptionKey: string): { title: string, contractKey: string } {
  		return renewOptions[renewOptionKey];
	}

	function selectRecordType (renewOption:any) {
		selectedRecord = renewOption;
		// @ts-ignore
		web3.action.setProps({
			newRecordKey: selectedRecord.contractKey,
			tokenIdHex: tokenIdToHex
		});
	}

	const ensContract = getEnsContract();

	let tokenIdToHex: number;

	let token:any;
	let loading = true;
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

	function getTokenDataByKey (token: TokenInterface, selectedKey: string): string | number | undefined {
		let recordData: string | number | undefined = "Record not found";
		const tokenData = token[selectedKey];
		if(tokenData) recordData = tokenData;
		return recordData;
	}

	function updateRecordInput (event:Event) {
		// @ts-ignore
		web3.action.setProps({ newRecordValue: (event.currentTarget as HTMLInputElement).value });
	}

	async function init() {
		selectRecordType(selectedRecord);
	}

</script>

<div>
	{#if token}
		<Header name={token.ensName} expiry={token.expiry} image={token.image_preview_url} />
		<div style="margin: 14px 0; background-color: white; border-radius: 7px; border: solid #C2C2C2 1px; width: 100%; display: flex; justify-content: space-between; flex-direction: column;">
			<div style="width: 100%;">
					<p style="
						font-size: 19px;
						font-weight: 500;
						text-align: center;
						">Record</p>
			</div>

			<div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
				<div style="padding: 10px 14px; border-radius: 20px; background-color: white; border: solid #C2C2C2 1px; max-width: 450px;">
					{#each Object.keys(renewOptions) as renewOptionKey, index (index)}
						{#if renewOptionKey === selectedRecord.title}
							<button class="record-option-btn" style="padding: 0 16px; float: left; display: block; background-color: #3888FF; border-radius: 38px; height: 31px; margin: 5px; text-align: center; border: none; cursor: pointer; color: white">{getRenewOption(renewOptions, renewOptionKey).title}</button>
						{/if}
						{#if renewOptionKey !== selectedRecord.title}
							<button class="record-option-btn" on:click={() => { selectRecordType(getRenewOption(renewOptions, renewOptionKey)) }} style="padding: 0 16px; float: left; display: block; background-color: #B6B6BF; border-radius: 38px; height: 31px; margin: 5px; text-align: center; border: none; cursor: pointer; color: white">{getRenewOption(renewOptions, renewOptionKey).title}</button>
						{/if}
				 	{/each}
				</div>
				<div style="display: flex; flex-direction: column; align-items: center; max-width: 450px; width: 100%;">
					<div style="background-color: #F5F5F5; border-radius: 20px; margin: 30px; padding: 24px; width: 100%;">
						<p style="color: #9A9A9A; font-weight: 600;">{selectedRecord.title} Value</p>
						{#if selectedRecord.contractKey === "avatar" }
							{#if token[selectedRecord.contractKey] }
								<img style="width: 100px; border-radius: 80px;" src={ token[selectedRecord.contractKey]} alt={selectedRecord.title}>
							{:else }
								<p style="color: #9A9A9A;">Record not found</p>
							{/if}
						{/if}
						{#if selectedRecord.contractKey !== "avatar" }
							<p style="color: #9A9A9A;">
								{
									getTokenDataByKey(token, selectedRecord.contractKey)
								}
							</p>
						{/if}
						<p style="color: #9A9A9A; font-weight: 600;">Update </p>
						<input placeholder="update {
							selectedRecord.contractKey
						} value here" id="newRecordValue" on:input={(event) => {
							updateRecordInput(event)
						}} style="padding: 20px; width: 100%; border-radius: 4px; border: none;" type="text" />
						<p style="color: #9A9A9A; font-weight: 300;">
							<small> { isEnsSubName ? `Note: this function will update the ${selectedRecord.contractKey} record of ${ensBaseName}.` : '' }</small>
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading}/>
</div>
