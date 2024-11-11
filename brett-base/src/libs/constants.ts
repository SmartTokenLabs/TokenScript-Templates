import {FeeAmount} from "@uniswap/v3-sdk";

export const POOL_FACTORY_CONTRACT_ADDRESS =
	'0x33128a8fC17869897dcE68Ed026d694621f6FDfD'
export const QUOTER_CONTRACT_ADDRESS =
	'0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a'

export interface TokenDetails {
	name: string,
	symbol: string,
	decimals: number,
	chainId: number,
	address: string,
	feeTier?: number
}

export const CHAIN_ID = parseInt(chainID);
export const RPC_PROVIDER = tokenscript.eth.getRpcProvider(CHAIN_ID);

export const SWAP_TOKEN_LIST: TokenDetails[] = [
	{
		name: 'Base Ethereum',
		symbol: 'ETH',
		decimals: 18,
		chainId: CHAIN_ID,
		address: '0x0000000000000000000000000000000000000000',
	},
	{
		name: 'Tether USD',
		symbol: 'USDT',
		decimals: 6,
		chainId: CHAIN_ID,
		address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2'
	},
	/*{
		name: 'Wrapped Matic',
		symbol: 'WMATIC',
		decimals: 18,
		chainId: CHAIN_ID,
		address: '0xc863399E5c5C4011B1DC3fB602902C77BA72B709'
	},*/
]

