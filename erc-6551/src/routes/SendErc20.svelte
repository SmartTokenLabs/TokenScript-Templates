<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { getTokenBoundClientInstance, setTokenBoundAccount } from './../lib/utils';

	let token: any;
	let loading = true;
	let tokenboundClient: any;
	let tokenBoundAccount: string;
	let sentToAccountValue = 0;
	let sentToAccount: undefined | string;
	let erc20ContractAddress: undefined | string;
	let erc20TokenCollectionMeta: any = {};
	let erc20TokenCollectionChain = 'eth';

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		token = value.token;
		// You can load other data before hiding the loader
		loading = false;
		tokenboundClient = getTokenBoundClientInstance(token.chainId);
		tokenBoundAccount = await setTokenBoundAccount(
			tokenboundClient,
			token.contractAddress,
			token.tokenId
		);
	});

	function init() {
		// @ts-ignore
		web3.action.setProps({
			sendERC20Chain: erc20TokenCollectionChain
		});
	}

	function updateToAddress(event: Event) {
		sentToAccount = (event.currentTarget as HTMLInputElement).value;
		// @ts-ignore
		web3.action.setProps({
			sendERC20ToAccount: (event.currentTarget as HTMLInputElement).value
		});
	}

	function updateChain(event: Event) {
		erc20TokenCollectionChain = (event.currentTarget as HTMLInputElement).value;
		// @ts-ignore
		web3.action.setProps({
			sendERC20Chain: erc20TokenCollectionChain
		});
	}

	async function updateContractAddress(event: Event) {
		erc20ContractAddress = (event.currentTarget as HTMLInputElement).value;

		// @ts-ignore
		web3.action.setProps({
			erc20ContractAddress: (event.currentTarget as HTMLInputElement).value
		});

		try {
			// @ts-ignore
			const response = await fetch(
				`https://api.token-discovery.tokenscript.org/get-fungible-token?blockchain=evm&collectionAddress=${erc20ContractAddress}&chain=${erc20TokenCollectionChain}`
			);
			erc20TokenCollectionMeta = await response.json();
		} catch (error) {
			console.log(error);
		}
	}

	function updateAmount(event: Event) {
		sentToAccountValue = Number((event.currentTarget as HTMLInputElement).value);
		// @ts-ignore
		web3.action.setProps({
			sendERC20AccountValue: (event.currentTarget as HTMLInputElement).value
		});
	}

	init();
</script>

<div>
	{#if token}
		<div style="font-family: 'helvetica'; padding: 20px; background: #fff;">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<h1 style="color: #6E47F3;font-size: 18px;">Send ERC20</h1>
				<div
					style="background: black;font-weight:600;border-radius: 9px;font-size: 12px;padding: 12px;color: white;"
				>
					Token Bound NFT
				</div>
			</div>
			<div
				style="background: #fff; background-image: radial-gradient(#CDCDD1 1px, transparent 0); background-size: 40px 40px; background-position: -19px -19px; height: 340px; margin-top: 32px;"
			>
				<div style="position: relative; top: 40px;">
					<div style="background: #fff; width: 180px;">
						<img
							style="height: 180px; width: 180px;border-radius: 14px;"
							src={token.image_preview_url}
							alt={token.description}
						/>
					</div>
					<div>
						<p
							style="font-size: 24px; font-weight: 600; margin: 12px 0; background: white; width: fit-content;"
						>
							{token.name}
						</p>
						<div
							style="display: flex;align-items: center; background: white; width: fit-content;"
						>
							<div style="width: 94px; display: flex;align-items: center;">
								<svg
									width="24px"
									height="100%"
									viewBox="0 0 100 100"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									xml:space="preserve"
									xmlns:serif="http://www.serif.com/"
									style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
								>
									<g transform="matrix(3.42498,0,0,3.42498,-121.249,-121.247)">
										<path
											d="M38.151,46.991L38.151,56.842C38.151,58.573 39.556,59.978 41.287,59.978C41.287,59.978 58.72,59.978 58.72,59.978C60.451,59.978 61.856,58.573 61.856,56.842C61.856,56.842 61.856,47.024 61.856,47.024C61.856,45.293 60.451,43.888 58.72,43.888C58.72,43.888 41.287,43.888 41.287,43.888C41.141,43.888 40.998,43.898 40.858,43.917C41.24,42.696 42.001,42.522 42.001,42.522C42.001,42.522 41.97,42.52 41.97,42.52C41.97,42.52 42.094,42.526 42.094,42.526C42.094,42.526 58.566,42.526 58.566,42.526C59.256,42.526 59.816,41.966 59.816,41.276C59.816,40.586 59.256,40.026 58.566,40.026L42.147,40.026C41.903,40.009 40.957,39.998 40.015,40.684C39.156,41.311 38.158,42.605 38.144,45.479C38.143,45.634 38.146,46.762 38.151,46.991ZM59.356,47.024L59.356,56.842C59.356,57.193 59.071,57.478 58.72,57.478L41.287,57.478C40.936,57.478 40.651,57.193 40.651,56.842C40.651,56.842 40.651,47.024 40.651,47.024C40.651,46.673 40.936,46.388 41.287,46.388L58.72,46.388C59.071,46.388 59.356,46.673 59.356,47.024ZM56.57,50.583C55.476,50.583 54.587,51.472 54.587,52.566C54.587,53.661 55.476,54.55 56.57,54.55C57.665,54.55 58.554,53.661 58.554,52.566C58.554,51.472 57.665,50.583 56.57,50.583Z"
											style="fill:rgb(131,131,135);"
										/>
									</g>
								</svg>
								<p
									style="font-size: 12px; padding: 0; color: #6D6D6D; margin: 0 7px;"
								>
									Account
								</p>
							</div>
							<a
								href={'https://etherscan.io/address/' + tokenBoundAccount}
								target="_blank"
								style="border-radius: 18px; background: white;font-size:12px;color: #6E47F3;padding: 6px 12px; word-break: break-all;"
							>
								{tokenBoundAccount}
							</a>
						</div>
					</div>
				</div>
			</div>
			<h2 style="color: #6D6D6D; font-size: 14px; font-weight: 400;">Transaction</h2>
			<div style="background: #FAFAFA;border-radius: 20px;padding: 24px;">
				<p style="color: #6E47F3;font-weight: 300;font-size: 12px;">To address</p>
				<input
					placeholder="update value 0x..."
					id="newRecordValue"
					style="border: solid 1px #B6B6BF; border-radius: 12px; padding: 9px; color: #6D6D6D; font-size: 12px; width: calc(100% - 12px); margin-bottom: 12px; font-weight: 300; font-family: 'helvetica';"
					on:input={(event) => {
						updateToAddress(event);
					}}
				/>
				<p style="color: #6E47F3;font-weight: 300;font-size: 12px;">ERC contract address</p>
				<input
					placeholder="update value 0x..."
					id="newRecordValue"
					style="border: solid 1px #B6B6BF; border-radius: 12px; padding: 9px; color: #6D6D6D; font-size: 12px; width: calc(100% - 12px); margin-bottom: 12px; font-weight: 300; font-family: 'helvetica';"
					on:input={(event) => {
						updateContractAddress(event);
					}}
				/>
				<label
					for="chain"
					style="color: rgb(110, 71, 243);
    font-size: 12px;
    font-weight: 300;
    display: block;
    margin-bottom: 12px;">Chain</label
				>
				<select
					id="chain"
					style="border-radius: 11px; padding: 6px; border: 1px solid rgb(182, 182, 191); color: rgb(117 117 117); font-size: 12px; font-family: 'helvetica'; font-weight: 300;"
					on:change={(event) => {
						updateChain(event);
					}}
				>
					<option value="eth">eth mainnet</option>
					<option value="goerli">goerli (eth testnet)</option>
					<option value="sepolia">sepolia (eth testnet)</option>
					<option value="polygon">polygon mainnet</option>
					<option value="mumbai">mumbai (polygon testnet)</option>
					<option value="bsc">bsc</option>
					<option value="bsc%20testnet">bsc (testnet)</option>
				</select>
				<p style="color: #6E47F3;font-weight: 300;font-size: 12px;">
					Amount {erc20TokenCollectionMeta?.symbol
						? `(${erc20TokenCollectionMeta.symbol})`
						: ''}
				</p>
				<input
					placeholder="update value"
					type="number"
					id="newRecordValue"
					style="border: solid 1px #B6B6BF; border-radius: 12px; padding: 9px; color: #6D6D6D; font-size: 12px; width: calc(100% - 12px); margin-bottom: 12px; font-weight: 300; font-family: 'helvetica';"
					on:input={(event) => {
						updateAmount(event);
					}}
				/>
				<div style="display: flex; justify-content: space-between;">
					<p
						style="color: #6e47f3;/* font-weight: 600; */font-size: 12px;margin-bottom: 22px;"
					>
						Summary
					</p>
					{#if erc20TokenCollectionMeta.image}
						<img
							style="width: 20px; height: 20px; position: relative; top: 12px;"
							alt={`${erc20TokenCollectionMeta?.title}`}
							src={`${erc20TokenCollectionMeta?.image}`}
						/>
					{/if}
				</div>
				<p style="font-size: 12px; font-weight: 300;">
					<span style="color: black;">Send </span>
					<span style="color: #6e47f3;"
						>{sentToAccountValue}
						{erc20TokenCollectionMeta?.symbol
							? erc20TokenCollectionMeta.symbol
							: ''}</span
					>
				</p>
				<p style="font-size: 12px; font-weight: 300;">
					From <span style="color: #6e47f3;"> {tokenBoundAccount}</span>
					<span>to</span>
					<span style="color: #6e47f3;"> {sentToAccount} </span>
				</p>
			</div>
		</div>
	{/if}
	<Loader show={loading} />
</div>
