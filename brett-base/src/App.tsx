import React, { useState, useEffect, FC } from "react";
import { Info } from "./cards/Info";
import { Buy } from "./cards/Buy";
import { Price } from "./cards/Price";
import { ShareToEarn } from "./cards/ShareToEarn";
import { NotFound } from "./cards/NotFound";
import {ITokenContextData} from "@tokenscript/card-sdk/dist/types";

const App: FC = () => {
	// add TokenScript Card views here
	enum CardName {
		Info = "#info",
		Buy = "#buy",
		Price = "#price",
		ShareToEarn = "#sharetoearn",
		NotFound = "#notFound",
	}

	const [CurrentPageName, setCurrentPageName] = useState<CardName>(
		CardName.Info
	);
	const [token, setToken] = useState<ITokenContextData>();

	const mapCardName = (card: string | null): CardName => {
		switch (card) {
			case CardName.Info:
				return CardName.Info;
			case CardName.Buy:
				return CardName.Buy;
			case CardName.Price:
				return CardName.Price;
			case CardName.ShareToEarn:
				return CardName.ShareToEarn;
			default:
				return CardName.NotFound;
		}
	};

	const cardComponents: { [key in CardName]: React.FC } = {
		[CardName.Info]: Info,
		[CardName.Buy]: Buy,
		[CardName.Price]: Price,
		[CardName.ShareToEarn]: ShareToEarn,
		[CardName.NotFound]: NotFound,
	};

	const CurrentPage = cardComponents[CurrentPageName];

	useEffect(() => {
		const routeChange = () => {
			const card = document.location.hash;
			const mappedCardName = mapCardName(card);
			setCurrentPageName(mappedCardName);
		};

		tokenscript.tokens.dataChanged = (prevTokens, newTokens, id) => {
			setToken(newTokens.currentInstance);
		};

		if (tokenscript.tokens.data.currentInstance) {
			setToken(tokenscript.tokens.data.currentInstance);
		}

		window.addEventListener("hashchange", routeChange);
		routeChange(); // Handle initial load

		return () => {
			window.removeEventListener("hashchange", routeChange);
		};
	}, []);

	return <CurrentPage token={token} />;
};

export default App;
