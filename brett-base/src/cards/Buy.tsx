import React from "react";

export const Buy: React.FC = () => {

	window.onConfirm = async () => {
		window.open("https://app.uniswap.org/swap?chain=base&inputCurrency=NATIVE&outputCurrency=0x532f27101965dd16442e59d40670faf5ebb142e4&value=1&field=output", "_blank");
	}

	return (
		<div style={{ margin: '0 auto', width: '200px', padding: "20px 0" }}>
			<img 
				style={{ width: '200px', borderRadius: '50%' }} 
				src="https://assets.coingecko.com/coins/images/33747/large/ogbretttttttt.jpg?1703454425"
				alt="Coingecko Logo" 
			/>
		</div>
	);

};
