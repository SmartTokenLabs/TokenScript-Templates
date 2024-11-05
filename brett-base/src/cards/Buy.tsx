import React from "react";
import { ITokenContextData } from "@tokenscript/card-sdk/dist/types";

interface BuyProps {
	token?: ITokenContextData;
	referralCode: string | null;
}

export const Buy: React.FC<BuyProps> = ({ token, referralCode }) => {
	// Example: log the token data or access specific fields
	console.log("Token data:", token, referralCode);

	window.onConfirm = async () => {
		window.open("https://app.uniswap.org/swap?chain=base&inputCurrency=NATIVE&outputCurrency=0x532f27101965dd16442e59d40670faf5ebb142e4&value=1&field=output", "_blank");
	};

	return (
		<div style={{ margin: '0 auto', width: '200px', padding: "20px 0" }}>
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
		</div>
	);
};
