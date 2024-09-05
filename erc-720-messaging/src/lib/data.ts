import { Contract, JsonRpcProvider, Network } from 'ethers';
import { Token } from './types';

const ensLookupCache: { [address: string]: string } = {};

export async function lookupEnsName(address: string) {
	if (ensLookupCache[address]) return ensLookupCache[address];

	const provider = new JsonRpcProvider(
		'https://eth-mainnet.g.alchemy.com/v2/2bJxn0VGXp9U5EOfA6CoMGU-rrd-BIIT',
		'mainnet',
		{
			staticNetwork: Network.from('mainnet')
		}
	); // TODO: get mainnet RPC URL via engine

	return await provider.lookupAddress(address) || "";
}

export interface CatListItem {
	tokenAddress: string;
	tokenUri?: string;
	owner: string;
}

export async function getContract(token: Token) {
	// let allRPCs = [];
	// if (chainID == 31337) {
	// 	allRPCs = ['http://localhost:8545'];
	// } else {
	// 	try {
	// 		// fetch more than 1K chains list
	// 		const chainsData = await fetch('https://chainid.network/chains.json');
	// 		const chains = await chainsData.json();
	// 		const currentChain = chains.filter((c) => c.chainId == chainID);
	// 		if (currentChain.length) {
	// 			allRPCs = currentChain[0].rpc;
	// 		}
	// 	} catch (e) {
	// 		console.log('Fetch chains failed.');
	// 		console.log(e);
	// 	}
	// }
	// const RPC_URL = window.rpcUrl ?? allRPCs[0];

	// @ts-expect-error chainID embedded as global variable
	const network = new Network('polygon', chainID);

	// @ts-expect-error rpcURL embedded as global variable
	const provider = new JsonRpcProvider(rpcURL, network, {
		staticNetwork: network
	});

	// TODO: get contract address from engine by origin name.
	return new Contract(
		token.contractAddress,
		[
			{
				"constant": true,
				"inputs": [],
				"name": "name",
				"outputs": [
					{
						"name": "",
						"type": "string"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "_spender",
						"type": "address"
					},
					{
						"name": "_value",
						"type": "uint256"
					}
				],
				"name": "approve",
				"outputs": [
					{
						"name": "",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "totalSupply",
				"outputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "_from",
						"type": "address"
					},
					{
						"name": "_to",
						"type": "address"
					},
					{
						"name": "_value",
						"type": "uint256"
					}
				],
				"name": "transferFrom",
				"outputs": [
					{
						"name": "",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "decimals",
				"outputs": [
					{
						"name": "",
						"type": "uint8"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "_owner",
						"type": "address"
					}
				],
				"name": "balanceOf",
				"outputs": [
					{
						"name": "balance",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "symbol",
				"outputs": [
					{
						"name": "",
						"type": "string"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "_to",
						"type": "address"
					},
					{
						"name": "_value",
						"type": "uint256"
					}
				],
				"name": "transfer",
				"outputs": [
					{
						"name": "",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "_owner",
						"type": "address"
					},
					{
						"name": "_spender",
						"type": "address"
					}
				],
				"name": "allowance",
				"outputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"payable": true,
				"stateMutability": "payable",
				"type": "fallback"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": true,
						"name": "spender",
						"type": "address"
					},
					{
						"indexed": false,
						"name": "value",
						"type": "uint256"
					}
				],
				"name": "Approval",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"name": "from",
						"type": "address"
					},
					{
						"indexed": true,
						"name": "to",
						"type": "address"
					},
					{
						"indexed": false,
						"name": "value",
						"type": "uint256"
					}
				],
				"name": "Transfer",
				"type": "event"
			}
		],
		provider
	);
}

export async function signMessage(msg: string): Promise<string> {
	return new Promise((resolve, reject) => {
		web3.personal.sign({ data: msg }, function (error, value) {
			if (error != null) {
				reject(error);
			} else {
				resolve(value);
				console.log(value);
			}
		});
	});
}
