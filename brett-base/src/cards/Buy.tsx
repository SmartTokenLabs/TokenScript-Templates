import React, {useEffect, useState} from "react";
import { ITokenContextData } from "@tokenscript/card-sdk/dist/types";
import { Token } from '@uniswap/sdk-core';
import {computePoolAddress, FeeAmount} from '@uniswap/v3-sdk';
import {quote, UniswapConfig} from "../libs/quote.ts";
import {toReadableAmount} from "../libs/conversion.ts";

interface BuyProps {
	token?: ITokenContextData;
	referralCode: string | null;
}

export const Buy: React.FC<BuyProps> = ({ token, referralCode }) => {
	// Example: log the token data or access specific fields
	console.log("Token data:", token, referralCode);

	const chainId = parseInt(chainID);
	const [outToken, setOutToken] = useState<Token|null>(null);
	const [inToken, setInToken] = useState<Token|null>(null);
	const [amountIn, setAmountIn] = useState<number>(0.0001);
	const [currentQuote, setCurrentQuote] = useState<string|null>(null);

	useEffect(() => {

		if (!token)
			return;

		setOutToken(new Token(
			token.chainId,
			token.contractAddress as string,
			18,
			'Degen',
			'DEGEN'
		));

		setInToken(new Token(
			chainId,
			'0x0000000000000000000000000000000000000000',
			18,
			'Base Ethereum',
			'ETH'
		));

		console.log("initial tokens set");

	}, [token]);

	useEffect(() => {

		if (inToken && outToken){
			const uniswapConfig: UniswapConfig = {
				rpc: {
					base: tokenscript.eth.getRpcUrls(chainId)[0]
				},
				tokens: {
					in: inToken,
					amountIn,
					out: outToken,
					poolFee: FeeAmount.MEDIUM,
				}
			}

			quote(uniswapConfig).then((newQuote) => {
				setCurrentQuote(newQuote);
				console.log("New quote: ", newQuote);
			});

			console.log("QUOTE STARTED")
		}

	}, [inToken, amountIn]);

	window.onConfirm = async () => {
		window.open("https://app.uniswap.org/swap?chain=base&inputCurrency=NATIVE&outputCurrency=0x532f27101965dd16442e59d40670faf5ebb142e4&value=1&field=output", "_blank");
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', width: '400x', padding: "20px 0" }}>
			<img
				style={{ width: '200px', borderRadius: '50%' }}
				src="https://assets.coingecko.com/coins/images/33747/large/ogbretttttttt.jpg?1703454425"
				alt="Coingecko Logo"
			/>
			{/* Display token data if available */}
			{token && (
				<div style={{ marginTop: '20px' }}>
					<p><strong>Token Name:</strong> {token.name}</p>
					<p><strong>Token ID:</strong> {token.id}</p>
				</div>
			)}
			<div className="field">
				<label>Purchase Currency</label>
				<select>
					<option value={ethers.ZeroAddress}>Base Ethereum</option>
				</select>
			</div>

			<div className="field">
				<label>Purchase</label>
				<input type="number" value={amountIn} onChange={(e) => setAmountIn(parseFloat(e.target.value))}/>
			</div>

			{currentQuote && (
				<div>
					You get approximately:
					{toReadableAmount(currentQuote.amountOut, outToken.decimals)} {token.symbol}
				</div>
			)}

		</div>
	);
};
