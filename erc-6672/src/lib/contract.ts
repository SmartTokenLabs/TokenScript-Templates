import { Contract, JsonRpcProvider, Network } from 'ethers';
import { Token } from './types';
import { abi } from './abi';

const ensLookupCache: { [address: string]: string } = {};

export async function getOperators(token: Token){
    const contract = await getContract(token);
    const operators = await contract.getOperators();
    return operators;
}

export async function getRedemptions(token: Token, operator:string){
    const contract = await getContract(token);
    const redemptions = await contract.getRedemptionIds(operator, token.tokenId);
    return redemptions;
}

export async function getAllowedRedemptionIds(token: Token, operator:string){
    const contract = await getContract(token);
    const redemptionIds = await contract.getAllowedRedempltionIds(operator);
    return redemptionIds;
}

export async function lookupEnsName(address: string) {
	if (ensLookupCache[address]) return ensLookupCache[address];

	const provider = new JsonRpcProvider(
		'https://eth-mainnet.g.alchemy.com/v2/2bJxn0VGXp9U5EOfA6CoMGU-rrd-BIIT',
		'mainnet',
		{
			staticNetwork: Network.from('mainnet')
		}
	); // TODO: get mainnet RPC URL via engine

	return await provider.lookupAddress(address);
}

export async function getContract(token: Token) {

	// @ts-expect-error chainID embedded as global variable
	const network = new Network('polygon', chainID);

	// @ts-expect-error rpcURL embedded as global variable
	const provider = new JsonRpcProvider(rpcURL, network, {
		staticNetwork: network
	});

	// TODO: get contract address from engine by origin name.
	return new Contract(
		token.contractAddress,
		abi,
		provider
	);
}

// export async function signMessage(msg: string): Promise<string> {
// 	return new Promise((resolve, reject) => {
// 		web3.personal.sign({ data: msg }, function (error, value) {
// 			if (error != null) {
// 				reject(error);
// 			} else {
// 				resolve(value);
// 				console.log(value);
// 			}
// 		});
// 	});
// }
