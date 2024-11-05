import React, { useState, useEffect, FC } from "react";
import { Info } from "./cards/Info";
import { Buy } from "./cards/Buy";
import { Price } from "./cards/Price";
import { ShareToEarn } from "./cards/ShareToEarn";
import { NotFound } from "./cards/NotFound";
import { ITokenContextData } from "@tokenscript/card-sdk/dist/types";

const App: FC = () => {
	enum CardName {
		Info = "Info",
		Buy = "Buy",
		Price = "Price",
		ShareToEarn = "ShareToEarn",
		NotFound = "NotFound",
	}

	const [CurrentPage, setCurrentPage] = useState<React.FC>(() => Info);
	const [token, setToken] = useState<ITokenContextData>();
	const [referralCode, setReferralCode] = useState<string | null>(null);

	const routingMap: Record<string, React.FC> = {
		[CardName.Info]: Info,
		[CardName.Buy]: Buy,
		[CardName.Price]: Price,
		[CardName.ShareToEarn]: ShareToEarn,
		[CardName.NotFound]: NotFound,
	};

	const routeChange = () => {
		const params = new URLSearchParams(window.location.hash.substring(1));
		const card = params.get("card");
		const code = params.get("referralCode");

		const SelectedComponent = routingMap[card as CardName] || NotFound;

		setCurrentPage(() => SelectedComponent);
		if(code) setReferralCode(code);
	};

	useEffect(() => {
		tokenscript.tokens.dataChanged = (prevTokens, newTokens, id) => {
			setToken(newTokens.currentInstance);
		};

		if (tokenscript.tokens.data.currentInstance) {
			setToken(tokenscript.tokens.data.currentInstance);
		}

		window.addEventListener("hashchange", routeChange);
		routeChange(); // Initial load

		return () => {
			window.removeEventListener("hashchange", routeChange);
		};
	}, []);

	return <CurrentPage token={token} referralCode={referralCode} />;
};

export default App;
