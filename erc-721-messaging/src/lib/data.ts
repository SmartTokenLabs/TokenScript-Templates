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
	tokenId: string;
	tokenUri: string;
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
				inputs: [
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256'
					}
				],
				name: 'ownerOf',
				outputs: [
					{
						internalType: 'address',
						name: 'address',
						type: 'address'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256'
					}
				],
				name: 'tokenURI',
				outputs: [
					{
						internalType: 'string',
						name: 'tokenURI',
						type: 'string'
					}
				],
				stateMutability: 'view',
				type: 'function'
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
