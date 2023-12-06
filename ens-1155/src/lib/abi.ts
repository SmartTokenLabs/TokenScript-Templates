import {Contract, JsonRpcProvider, Network} from "ethers";

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

function getEthersProvider(){
	// @ts-ignore
	const network = new Network("mainnet", chainID);

	// @ts-ignore
	const RPC_URL = rpcURL;

	return new JsonRpcProvider(RPC_URL, network, {
		staticNetwork: network
	});
}

export function getEnsContract(){

	const provider = getEthersProvider();

	const nameWrapperContract =
		"0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401"; // Mainnet
		//"0x0635513f179D50A207757E05759CbD106d7dFcE8"; // Sepolia

	return new Contract(nameWrapperContract, ensAbi, provider);
}
