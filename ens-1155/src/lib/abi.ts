import { Contract, JsonRpcProvider, Network } from "ethers";

export const ensAbi = [
	{
		"stateMutability": "view",
		"type": "function",
		"inputs": [
			{ "internalType": "uint256", "name": "id", "type": "uint256" }
		],
		"name": "getData",
		"outputs": [
			{ "internalType": "address", "name": "owner", "type": "address" },
			{ "internalType": "uint32", "name": "fuses", "type": "uint32" },
			{ "internalType": "uint64", "name": "expiry", "type": "uint64" }
		]
	},
	{
		"stateMutability": "view",
		"type": "function",
		"inputs": [
			{ "internalType": "bytes32", "name": "", "type": "bytes32" }
		],
		"name": "names",
		"outputs": [
			{ "internalType": "bytes", "name": "", "type": "bytes" }
		],
	},
];

let provider;

export function getEthersProvider() {

	if (!provider) {
		// @ts-ignore
		const network = new Network("mainnet", chainID);

		// @ts-ignore
		const RPC_URL = rpcURL;

		provider = new JsonRpcProvider(RPC_URL, network, {
			staticNetwork: network
		});
	}

	return provider;
}

export function getEnsContract() {

	const provider = getEthersProvider();

	const nameWrapperContract =
		"0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401"; // Mainnet
	// "0x0635513f179D50A207757E05759CbD106d7dFcE8"; // Sepolia

	return new Contract(nameWrapperContract, ensAbi, provider);
}

const registrarABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "duration",
				"type": "uint256"
			}
		],
		"name": "renew",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	}
];

export function getEnsEthRegistrarContract() {

	const provider = getEthersProvider();

	const nameWrapperContract =
		"0x253553366Da8546fC250F225fe3d25d0C782303b"; // Mainnet
	// "0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72"; // Sepolia

	return new Contract(nameWrapperContract, registrarABI, provider);
}
