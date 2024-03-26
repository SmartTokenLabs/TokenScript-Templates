type ChainConfig = {
  name: string
  rpc: string
  explorer: string
  tokenDiscoveryChainRef: string
}

type ChainConfigMap = {
  [key in number]: ChainConfig
}

export const chainConfig: ChainConfigMap = {
  1: {
    name: "ETHEREUM",
    rpc: "https://nodes.mewapi.io/rpc/eth",
    explorer: "https://etherscan.com/",
    tokenDiscoveryChainRef: "eth"
  },
  5: {
    name: "GOERLI",
    rpc: "https://rpc.ankr.com/eth_goerli",
    explorer: "https://goerli.etherscan.io/",
    tokenDiscoveryChainRef: "goerli"
  },
  11155111: {
    name: "SEPOLIA",
    rpc: "https://endpoints.omniatech.io/v1/eth/sepolia/public",
    explorer: "https://sepolia.etherscan.io/",
    tokenDiscoveryChainRef: "sepolia"
  },
  137: {
    name: "POLYGON",
    rpc: "https://polygon-rpc.com/",
    explorer: "https://polygonscan.com/",
    tokenDiscoveryChainRef: "polygon"
  },
  80001: {
    name: "MUMBAI",
    rpc: "https://polygon-mumbai.api.onfinality.io/public",
    explorer: "https://mumbai.polygonscan.com/",
    tokenDiscoveryChainRef: "mumbai"
  },
  56: {
    name: "BSC",
    rpc: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com/",
    tokenDiscoveryChainRef: "bsc"
  },
  97: {
    name: "BSC_TESTNET",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorer: "https://testnet.bscscan.com/",
    tokenDiscoveryChainRef: "bsc_testnet"
  },
  43114: {
    name: "AVALANCH",
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://cchain.explorer.avax.network/",
    tokenDiscoveryChainRef: "avalanche"
  },
  250: {
    name: "FANTOM",
    rpc: "https://rpc.fantom.network/",
    explorer: "https://ftmscan.com/",
    tokenDiscoveryChainRef: "fantom"
  },
  42161: {
    name: "ARBITRUM",
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io/",
    tokenDiscoveryChainRef: "arbitrum"
  },
  10: {
    name: "OPTIMISM",
    rpc: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io/",
    tokenDiscoveryChainRef: "optimism"
  },
  8217: {
    name: "KLAYTN",
    rpc: "https://public-node-api.klaytnapi.com/v1/cypress",
    explorer: "https://scope.klaytn.com/",
    tokenDiscoveryChainRef: "klaytn"
  },
  1001: {
    name: "BAOBAB",
    rpc: "https://public-node-api.klaytnapi.com/v1/baobab",
    explorer: "https://baobab.scope.klaytn.com/",
    tokenDiscoveryChainRef: "baobab"
  },
}


