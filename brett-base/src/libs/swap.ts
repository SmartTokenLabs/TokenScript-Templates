import {fromReadableAmount} from "./conversion.ts";
import {UniswapConfig} from "./quote.ts";
import {CHAIN_ID, RPC_PROVIDER} from "./constants.ts";
/*import {computePoolAddress, Pool, Route, SwapOptions, SwapQuoter, SwapRouter, Trade} from "@uniswap/v3-sdk";
import {Currency, CurrencyAmount, Percent, Token, TradeType} from "@uniswap/sdk-core";
import {POOL_FACTORY_CONTRACT_ADDRESS, QUOTER_CONTRACT_ADDRESS, SWAP_ROUTER_ADDRESS} from "./constants.ts";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import {
	AlphaRouter,
	SwapOptionsSwapRouter02,
	SwapRoute,
	SwapType,
} from '@uniswap/smart-order-router/build/module'

export type TokenTrade = Trade<Token, Token, TradeType>;*/

//const walletProvider = new ethers.BrowserProvider(window.ethereum);

export async function swap(config: UniswapConfig, amountOutMinimum: bigint){

	//const poolInfo = await getPoolInfo(config);

	const amountInWei = fromReadableAmount(
		config.tokens.amountIn,
		config.tokens.in.decimals
	).toString();

	if (!config.tokens.in.isNative){

		console.log("Checking approval...")

		const approved = await getApprovalValue(walletAddress, config.tokens.in.address);

		console.log("Approved: ", approved);

		if (amountInWei > approved){

			console.log("Approval required, sending approve transaction");

			tokenscript.action.setProps({
				approveAmt: amountInWei
			});

			if (!await tokenscript.action.executeTransaction({
				txName: "approveERC20",
				triggers: [],
				chainId: CHAIN_ID,
				contractAddress: config.tokens.in.address
			})){
				return;
			}
		}
	}

	tokenscript.action.setProps({
		params: {
			tokenIn: config.tokens.in.wrapped.address,
			tokenOut: config.tokens.out.wrapped.address,
			fee: config.tokens.poolFee,
			recipient: walletAddress,
			amountIn: amountInWei,
			amountOutMinimum,
			sqrtPriceLimitX96: 0 //poolInfo.sqrtPriceX96,
		},
		ethValue: config.tokens.in.isNative ? amountInWei : 0
	})

	if (!await tokenscript.action.executeTransaction("exactInputSingle"))
		return;
}

async function getApprovalValue(walletAddr: string, contractAddr: string){

	const contract = getERC20Contract(contractAddr);

	const swapRouterAddress = tokenscript.eth.getContractInfo("SwapRouter").address;

	return await contract.getFunction("allowance").staticCall(walletAddr, swapRouterAddress);
}

export async function getERC20Contract(contractAddr: string): ethers.Contract {
	return new ethers.Contract(contractAddr, [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "spender",
					"type": "address"
				}
			],
			"name": "allowance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	], RPC_PROVIDER);
}

/*export async function generateRoute(config: UniswapConfig): Promise<SwapRoute | null> {

	const walletAddress = (await walletProvider.listAccounts())[0]?.address;

	const router = new AlphaRouter({
		CHAIN_ID,
		provider: RPC_PROVIDER,
	})

	const options: SwapOptionsSwapRouter02 = {
		recipient: walletAddress,
		slippageTolerance: new Percent(50, 10_000),
		deadline: Math.floor(Date.now() / 1000 + 1800),
		type: SwapType.SWAP_ROUTER_02,
	}

	const route = await router.route(
		CurrencyAmount.fromRawAmount(
			config.tokens.in,
			fromReadableAmount(
				config.tokens.amountIn,
				config.tokens.in.decimals
			).toString()
		),
		config.tokens.out,
		TradeType.EXACT_INPUT,
		options
	)

	return route
}

export async function createTrade(config: UniswapConfig): Promise<Trade<Token | Ether, Token | Ether, TradeType>> {

	const poolInfo = await getPoolInfo(poolContract);

	console.log("Pool info: ", poolInfo);

	const pool = new Pool(
		config.tokens.in.wrapped,
		config.tokens.out.wrapped,
		config.tokens.poolFee,
		poolInfo.sqrtPriceX96.toString(),
		poolInfo.liquidity.toString(),
		Number(poolInfo.tick)
	)

	const swapRoute = new Route(
		[pool],
		config.tokens.in.wrapped,
		config.tokens.out.wrapped
	)

	const quote = await getOutputQuote(config, swapRoute);

	console.log("quote: ", quote[0]);

	const uncheckedTrade = Trade.createUncheckedTrade({
		route: swapRoute,
		inputAmount: CurrencyAmount.fromRawAmount(
			config.tokens.in,
			fromReadableAmount(
				config.tokens.amountIn,
				config.tokens.in.decimals
			).toString()
		),
		outputAmount: CurrencyAmount.fromRawAmount(
			config.tokens.out,
			quote[0].toString()
		),
		tradeType: TradeType.EXACT_INPUT,
	})

	return uncheckedTrade


}

export async function executeTrade(
	config: UniswapConfig,
	trade: TokenTrade
) {
	const walletAddress = (await walletProvider.listAccounts())[0]?.address;

	if (!walletAddress || !walletProvider) {
		throw new Error('Cannot execute a trade without a connected wallet')
	}

	console.log("Wallet address: ", walletAddress);

	// TODO: Implement permit approval for contracts that support it

	// Give approval to the router to spend the token
	await switchChainAndApproveIfRequired(walletAddress, config.tokens.in.wrapped.address, fromReadableAmount(
		config.tokens.amountIn,
		config.tokens.in.decimals
	));

	const options: SwapOptions = {
		slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
		deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
		recipient: walletAddress,
	}

	const methodParameters = SwapRouter.swapCallParameters([trade], options)

	const tx = {
		data: methodParameters.calldata,
		to: SWAP_ROUTER_ADDRESS,
		value: methodParameters.value,
		from: walletAddress
	}

	return (await walletProvider.getSigner()).sendTransaction(tx);
}

async function getOutputQuote(config: UniswapConfig, route: Route<Currency, Currency>) {

	if (!RPC_PROVIDER) {
		throw new Error('Provider required to get pool state')
	}

	const { calldata } = await SwapQuoter.quoteCallParameters(
		route,
		CurrencyAmount.fromRawAmount(
			config.tokens.in,
			fromReadableAmount(
				config.tokens.amountIn,
				config.tokens.in.decimals
			).toString()
		),
		TradeType.EXACT_INPUT,
		{
			useQuoterV2: true,
			sqrtPriceLimitX96: 0
		}
	)

	const quoteCallReturnData = await RPC_PROVIDER.call({
		to: QUOTER_CONTRACT_ADDRESS,
		data: calldata,
	})

	return ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], quoteCallReturnData) as [bigint];
}

export async function getPoolInfo(config: UniswapConfig) {

	const currentPoolAddress = computePoolAddress({
		factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
		tokenA: config.tokens.in.wrapped,
		tokenB: config.tokens.out.wrapped,
		fee: config.tokens.poolFee,
		CHAIN_ID
	});

	console.log("Pool address: ", currentPoolAddress);

	const poolContract = new ethers.Contract(
		currentPoolAddress,
		IUniswapV3PoolABI.abi,
		RPC_PROVIDER
	)
	
	const [token0, token1, fee, liquidity, slot0] = await Promise.all([
		poolContract.token0(),
		poolContract.token1(),
		poolContract.fee(),
		poolContract.liquidity(),
		poolContract.slot0(),
	]);

	return {
		token0,
		token1,
		fee,
		liquidity,
		sqrtPriceX96: slot0[0],
		tick: slot0[1],
	}
}

async function approveErc20(erc20Address: string, amount: bigint){

	const contract = new ethers.Contract(erc20Address, [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "spender",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "approve",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	], await walletProvider.getSigner());

	const tx = await contract["approve"](SWAP_ROUTER_ADDRESS, amount);

	tokenscript.action.showTransactionToast("submitted", Number(CHAIN_ID), tx.hash);

	await tx.wait(1);

	tokenscript.action.showTransactionToast("confirmed", Number(CHAIN_ID), tx.hash);

	return true;
}*/
