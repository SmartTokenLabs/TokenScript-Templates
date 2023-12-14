import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
let {
  PRIVATE_KEY,
  ALCHEMY_API_KEY,
  ALCHEMY_RINKEBY_API_KEY,
  ALCHEMY_ROPSTEN_API_KEY,
  ETHERSCAN_API_KEY,
  INFURA_API_KEY,
  INFURA_API_KEY2,
  INFURA_API_KEY3,
  ARBISCAN_API_KEY,
  POLYGONSCAN_API_KEY,
  OPTIMISM_API_KEY,
  ALCHEMY_ARBITRUM_API_KEY,
} = process.env;

PRIVATE_KEY = PRIVATE_KEY ? PRIVATE_KEY : "0x2222453C7891EDB92FE70662D5E45A453C7891EDB92FE70662D5E45A453C7891";

// if not defined .env then set empty API keys, we dont use it for tests
INFURA_API_KEY = INFURA_API_KEY ? INFURA_API_KEY : "";
INFURA_API_KEY2 = INFURA_API_KEY2 ? INFURA_API_KEY2 : "";
INFURA_API_KEY3 = INFURA_API_KEY3 ? INFURA_API_KEY3 : "";
ALCHEMY_API_KEY = ALCHEMY_API_KEY ? ALCHEMY_API_KEY : "";
ETHERSCAN_API_KEY = ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : "";
ALCHEMY_RINKEBY_API_KEY = ALCHEMY_RINKEBY_API_KEY ? ALCHEMY_RINKEBY_API_KEY : "";
ALCHEMY_ROPSTEN_API_KEY = ALCHEMY_ROPSTEN_API_KEY ? ALCHEMY_ROPSTEN_API_KEY : "";

ARBISCAN_API_KEY = ARBISCAN_API_KEY ? ARBISCAN_API_KEY : "";
POLYGONSCAN_API_KEY = POLYGONSCAN_API_KEY ? POLYGONSCAN_API_KEY : "";
OPTIMISM_API_KEY = OPTIMISM_API_KEY ? OPTIMISM_API_KEY : "";
ALCHEMY_ARBITRUM_API_KEY = ALCHEMY_ARBITRUM_API_KEY ? ALCHEMY_ARBITRUM_API_KEY : "";

const config: HardhatUserConfig = {
  solidity: {
		version: '0.8.20',
    	settings: {
			optimizer: { enabled: true, runs: 200 },
		}
	},
	networks: {
	// 	hardhat: {
	// 		accounts: {
	// 			count: 10,
	// 			mnemonic: 'demo junk test demo junk test demo junk test demo junk test',
	// 			path: "m/44'/60'/0'/0",
	// 		},
	// 	},
    polygonMumbai: {
      url: `https://rpc-mumbai.maticvigil.com`, 
      accounts: [`${PRIVATE_KEY}`],
      // url: `https://polygon-mumbai-bor.publicnode.com`, 
    },
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // apiKey: ${ETHERSCAN_API_KEY2}
    apiKey: {
      mainnet: `${ETHERSCAN_API_KEY}`,
      rinkeby: `${ETHERSCAN_API_KEY}`,
      ropsten: `${ETHERSCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
      arbitrumTestnet: `${ARBISCAN_API_KEY}`,
      arbitrumOne: `${ARBISCAN_API_KEY}`,
      polygonMumbai: `${POLYGONSCAN_API_KEY}`,
      polygon: `${POLYGONSCAN_API_KEY}`,
      optimisticEthereum: `${OPTIMISM_API_KEY}`,
      optimisticKovan: `${OPTIMISM_API_KEY}`,
    },
  },
};

export default config;
