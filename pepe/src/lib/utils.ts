import { ethers } from 'ethers';

export function formatWithByDecimalPlaces(num: number, decimalPlaces = 2) {
  return num.toFixed(decimalPlaces);
}

export function previewAddr(inputString: string) {
  if (inputString.length < 10) {
    return inputString;
  } else {
    const firstChars = inputString.substring(0, 6);
    const lastChars = inputString.substring(inputString.length - 4);
    return `${firstChars}...${lastChars}`;
  }
}

export function previewAddrStart(inputString: string) {
  if (inputString.length < 10) {
    return inputString;
  } else {
    const firstChars = inputString.substring(0, 6);
    return `${firstChars}`;
  }
}

export function formatTokenBalance(balance: string | number | undefined, decimals: number) {
  if (!balance) return 0;
  const _decimals = decimals ?? 18;
  return ethers.formatUnits(balance, _decimals);
}

export async function fetchENSImage(ensName: string) {
  try {
    const response = await fetch(`https://metadata.ens.domains/mainnet/avatar/${ensName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ENS image');
    }
    return response.blob();
  } catch (error) {
    console.error('Error fetching ENS image:', error);
    return undefined;
  }
}

type ChainConfig = {
  name: string
  rpc: string
  explorer: string
}

type ChainConfigMap = {
  [key in number]: ChainConfig
}

export const chainConfig: ChainConfigMap = {
  1: {
    name: "ETHEREUM",
    rpc: "https://nodes.mewapi.io/rpc/eth",
    explorer: "https://etherscan.com/",
  },
  5: {
    name: "GOERLI",
    rpc: "https://rpc.ankr.com/eth_goerli",
    explorer: "https://goerli.etherscan.io/",
  },
  11155111: {
    name: "SEPOLIA",
    rpc: "https://endpoints.omniatech.io/v1/eth/sepolia/public",
    explorer: "https://sepolia.etherscan.io/",
  },
  137: {
    name: "POLYGON",
    rpc: "https://polygon-rpc.com/",
    explorer: "https://polygonscan.com/",
  },
  80001: {
    name: "MUMBAI",
    rpc: "",
    explorer: "https://mumbai.polygonscan.com/",
  },
  56: {
    name: "BSC",
    rpc: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com/",
  },
  97: {
    name: "BSC_TESTNET",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorer: "https://testnet.bscscan.com/",
  },
  43114: {
    name: "AVALANCH",
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://cchain.explorer.avax.network/",
  },
  250: {
    name: "FANTOM",
    rpc: "https://rpc.fantom.network/",
    explorer: "https://ftmscan.com/",
  },
  42161: {
    name: "ARBITRUM",
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io/",
  },
  10: {
    name: "OPTIMISM",
    rpc: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io/",
  },
  8217: {
    name: "KLAYTN",
    rpc: "https://public-node-api.klaytnapi.com/v1/cypress",
    explorer: "https://scope.klaytn.com/",
  },
  1001: {
    name: "BAOBAB",
    rpc: "https://public-node-api.klaytnapi.com/v1/baobab",
    explorer: "https://baobab.scope.klaytn.com/",
  },
}


