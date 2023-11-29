<script lang="ts">
	import context from "../lib/context";
	import Loader from "../components/Loader.svelte";
	import { token, updateToken } from "../types/tokenTypes";
	import type { TokenInterface } from "../types/tokenTypes";

	let expiry:string;
	let loading = true;
	let contract: unknown;
	let evmProvider:any;
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

	function getTokenDataByKey (token:TokenInterface, selectedKey: string): string | number | undefined {
		let recordData: string | number | undefined = "Record not found";
		const tokenData = token[selectedKey];
		if(tokenData) recordData = tokenData;
		return recordData;
	}

	context.data.subscribe(async (value) => {
		if (!value.token) return;

		updateToken(value.token);
		expiry = dateToUIDate(token.nameExpires * 1000);

		// You can load other data before hiding the loader
		loading = false;
	});

	function dateToUIDate(dateValue:number):string {
		if(!dateValue) return 'Could not be found';
		const userLocale = navigator.language;
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		return new Date(dateValue).toLocaleDateString(userLocale, options as Intl.DateTimeFormatOptions);
	}

	function selectRecordType (renewOption:any) {
		selectedRecord = renewOption;
		// @ts-ignore
		web3.action.setProps({ newRecordKey: selectedRecord.contractKey });
	}

	function updateRecordInput (event:Event) {
		// @ts-ignore
		web3.action.setProps({ newRecordValue: (event.currentTarget as HTMLInputElement).value });
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
						">Update Record</p>
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
						<input placeholder="update { selectedRecord.contractKey } value here" id="newRecordValue" on:input={(event) => { updateRecordInput(event) }} style="padding: 20px; width: 100%; border-radius: 4px; border: none;" type="text" />
					</div>
				</div>
			</div>
		</div>
	{/if}
	<Loader show={loading}/>
</div>

