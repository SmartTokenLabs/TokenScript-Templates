<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	import { ethers, JsonRpcProvider, Wallet } from 'ethers';
	import { TokenboundClient } from '@tokenbound/sdk';
	import { encodeFunctionData } from 'viem';
	import { getTokenBoundClientInstance, setTokenBoundAccount } from './../lib/utils';

	let token: any;
	let loading = true;
	let sentToAccountValue = 0;
	let sentToAccount: undefined | string;
	let tokenboundClient: any;
	let tokenBoundAccount: string;

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

	function updateToAddress(event: Event) {
		sentToAccount = (event.currentTarget as HTMLInputElement).value;
	}

	async function updateAmount(event: Event) {
		// sentToAccountValue = Number((event.currentTarget as HTMLInputElement).value);
		// const rpcEndpoint = 'https://nodes.mewapi.io/rpc/eth';
		// // mock private key for creating signer
		// const privateKey = '0000000000000000000000000000000000000000000000000000000000000000';
		// const provider = new JsonRpcProvider(rpcEndpoint);
		// const signer = new Wallet(privateKey, provider);
		// const tokenboundClient = new TokenboundClient({ signer, chainId: 5 });
		// const amountInWei = ethers.parseEther(sentToAccountValue.toString());
		// const preparedExecution = await tokenboundClient.prepareExecution({
		// 	account: '<account_address>',
		// 	to: '<contract_address>',
		// 	value: '<wei_value>',
		// 	data: '<encoded_call_data>', (optional)
		// })
		// 0.11 ETH
		// amountInWei: 110000000000000000n
		// @ts-ignore
		// const preparedCall = await tokenboundClient.prepareExecution({
		// 	account: tokenBoundAddress as `0x${string}`,
		// 	to: sentToAccount as `0x${string}`,
		// 	value: amountInWei,
		// 	data: '0x'
		// });
		// Define the transaction parameters
		// const transaction = {
		// 	to: '0xRecipientAddress',
		// 	value: ethers.utils.parseEther('1.0'), // Sending 1 ETH
		// 	gasLimit: 21000, // Replace with the appropriate gas limit
		// 	gasPrice: ethers.utils.parseUnits('50', 'gwei'), // Replace with the desired gas price
		// };
		// // Send the transaction using the wallet provider
		// const transactionResponse = await wallet.sendTransaction(transaction);
		// const transferCallData = encodeFunctionData({
		// 	abi: zora721.abi,
		// 	functionName: 'safeTransferFrom',
		// 	args: [
		// 		ANVIL_USER_0, // from
		// 		ZORA721_TBA_ADDRESS, // to
		// 		BigInt(TOKENID1_IN_TBA), // tokenId
		// 	],
		// })
		// console.log('prepared input', preparedCall);
		// // @ts-ignore
		// web3.action.setProps({
		// 	sendEthToAccount: sentToAccount,
		// 	// sendEthToAccount: preparedCall.to,
		// 	// sendEthAccountValue: preparedCall.value, // = 0n
		// 	sendEthAccountValue: amountInWei,
		// 	sendEthData: preparedCall.data
		// });
	}
</script>

<div>
	{#if token}
		<div style="font-family: 'helvetica'; padding: 20px; background: #fff;">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<h1 style="color: #6E47F3;font-size: 18px;">Send ETH</h1>
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
					placeholder="update value here 0x..."
					id="newRecordValue"
					style="border: solid 1px #B6B6BF; border-radius: 12px; padding: 9px; color: #6D6D6D; font-size: 12px; width: calc(100% - 12px); margin-bottom: 12px; font-weight: 300; font-family: 'helvetica';"
					on:input={(event) => {
						updateToAddress(event);
					}}
				/>
				<p style="color: #6E47F3;font-weight: 300;font-size: 12px;">Amount (ETH)</p>
				<input
					placeholder="update value"
					type="number"
					id="newRecordValue"
					style="border: solid 1px #B6B6BF; border-radius: 12px; padding: 9px; color: #6D6D6D; font-size: 12px; width: calc(100% - 12px); margin-bottom: 12px; font-weight: 300; font-family: 'helvetica';"
					on:input={(event) => {
						updateAmount(event);
					}}
				/>
				<p
					style="color: #6e47f3;/* font-weight: 600; */font-size: 12px;margin-bottom: 22px;"
				>
					Summary
				</p>
				<p style="font-size: 12px; font-weight: 300;">
					<span style="color: black;">Send </span>
					<span style="color: #6e47f3;">{sentToAccountValue}</span>
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
