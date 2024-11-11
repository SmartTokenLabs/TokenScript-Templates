import React, {useEffect, useState} from "react";
import { ITokenContextData } from "@tokenscript/card-sdk/dist/types";
import {Ether, Token} from '@uniswap/sdk-core';
import {ADDRESS_ZERO, FeeAmount} from '@uniswap/v3-sdk';
import {quote, UniswapConfig} from "../libs/quote.ts";
import {toReadableAmount} from "../libs/conversion.ts";
import {RPC_PROVIDER, SWAP_TOKEN_LIST, TokenDetails} from "../libs/constants.ts";
import {getERC20Contract, swap} from "../libs/swap.ts";

interface BuyProps {
	token?: ITokenContextData;
	referralCode: string | null;
}

export const Buy: React.FC<BuyProps> = ({ token, referralCode }) => {

	const chainId = parseInt(chainID);
	const [outToken, setOutToken] = useState<Token|null>(null);
	const [inToken, setInToken] = useState<Token|Ether|null>(null);
	const [amountIn, setAmountIn] = useState<number>(0.0001);
	const [currentQuote, setCurrentQuote] = useState<{amountOut: bigint}|null>(null);
	const [currentBalance, setCurrentBalance] = useState<bigint|null>(null)

	useEffect(() => {

		if (!token)
			return;

		console.log("Token data:", token, referralCode);

		setOutToken(new Token(
			token.chainId,
			token.contractAddress as string,
			token.decimals ?? 18,
			token.name,
			token.symbol
		));

		/**
		 * 18,
		 * 'Degen',
		 * 'DEGEN'
		 */

		setInCurrency(SWAP_TOKEN_LIST[0]);

		console.log("initial tokens set");

	}, [token]);

	useEffect(() => {

		if (inToken){

			if (inToken.isNative){
				RPC_PROVIDER.getBalance(walletAddress).then((balance) => {
					setCurrentBalance(balance);
				});
			} else {
				const contract = getERC20Contract(inToken.wrapped.address);
				contract.getFunction("allowance").staticCall(walletAddress).then((balance) => {
					setCurrentBalance(balance);
				})
			}
		}

		if (outToken && amountIn > 0){

			const uniswapConfig: UniswapConfig = {
				rpc: {
					base: tokenscript.eth.getRpcUrls(chainId)[0]
				},
				tokens: {
					in: inToken.wrapped,
					amountIn,
					out: outToken.wrapped,
					poolFee: FeeAmount.LOW,
				}
			}

			quote(uniswapConfig).then((newQuote) => {
				setCurrentQuote(newQuote);
				console.log("New quote: ", newQuote);
			});

		} else {
			setCurrentQuote(null);
		}

	}, [inToken, amountIn]);

	window.onConfirm = async () => {
		window.open("https://app.uniswap.org/swap?chain=base&inputCurrency=NATIVE&outputCurrency=0x532f27101965dd16442e59d40670faf5ebb142e4&value=1&field=output", "_blank");
	};

	function setInCurrency(tokenDetails: TokenDetails){
		setInToken(
			tokenDetails.address === ADDRESS_ZERO ?
				new Ether(chainId) :
				new Token(
					tokenDetails.chainId,
					tokenDetails.address,
					tokenDetails.decimals,
					tokenDetails.symbol,
					tokenDetails.name
				)
		);
	}

	async function swapToken(){

		const config: UniswapConfig = {
			rpc: {
				base: tokenscript.eth.getRpcUrls(chainId)[0]
			},
			tokens: {
				in: inToken!,
				amountIn,
				out: outToken!,
				poolFee: FeeAmount.LOW,
			}
		}

		await swap(config, currentQuote!.amountOut);
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', width: '400x', padding: "20px 0" }}>
			<div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1}}>
				<img
					style={{ width: '200px', borderRadius: '50%' }}
					src="https://assets.coingecko.com/coins/images/33747/large/ogbretttttttt.jpg?1703454425"
					alt="Coingecko Logo"
				/>
				{/* Display token data if available */}
				{token && (
					<div style={{ marginTop: '20px' }}>
						<p><strong>Token Name:</strong> {token.name}</p>
					</div>
				)}
				{/*<div className="field">
					<label>Purchase Currency</label>
					<select>
						{SWAP_TOKEN_LIST.map((token) => {
							return (
								<option onClick={() => setInCurrency(token)}
								        selected={!!(inToken && token.address === (inToken?.isNative ? ADDRESS_ZERO : inToken.wrapped.address))}>
									{token.name}
								</option>
							)
						})}
					</select>
				</div>*/}

				<div className="field">
					<label>Purchase</label>
					<input type="number" value={amountIn} onChange={(e) => {
						const newAmount = parseFloat(e.target.value) ?? 0;
						setAmountIn(newAmount);
					}}/>
					{inToken?.name}
				</div>

				{
					currentBalance && (
						<div className="field">
							<strong>Balance: </strong>
							<span>{toReadableAmount(currentBalance, inToken?.decimals)}</span>
						</div>
					)
				}

				{currentQuote && (
					<div style={{margin: "10px 0"}}>
						You get approximately:
						{toReadableAmount(currentQuote.amountOut, outToken.decimals)} {token.symbol}
					</div>
				)}

			</div>
			<div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1}}>
				<button onClick={() => swapToken()}>Swap</button>
			</div>
		</div>
	);
};
