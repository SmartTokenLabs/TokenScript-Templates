import React from "react";

export const Price: React.FC = () => {

	window.onConfirm = async () => {
		window.open("https://www.coingecko.com/en/coins/brett-2", "_blank");
	}

	return (
		<div style={{ margin: '0 auto', width: '200px', padding: "20px 0" }}>
			<img 
				style={{ width: '200px', borderRadius: '50%' }} 
				src="https://support.coingecko.com/hc/article_attachments/4499575478169"
				alt="Coingecko Logo" 
			/>
			<div style={{ fontSize: '20px', margin: '4px', color:'#4c4c4c', fontFamily: 'Inter', textAlign: 'center' }}>CoinGecko</div>
		</div>
	);
};
