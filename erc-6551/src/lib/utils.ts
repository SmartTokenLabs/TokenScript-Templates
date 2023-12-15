import { TokenboundClient } from '@tokenbound/sdk';
import { Wallet, JsonRpcProvider } from 'ethers';

export const getTokenBoundClientInstance = (chainId: number) => {
  const rpcEndpoint = 'https://nodes.mewapi.io/rpc/eth';
  // mock wallet created
  const privateKey = '8810c6419ad377df7ff6bf3a8dace8b6cb453141b4bc5d26f3b1e0a553ccd05c';
  const provider = new JsonRpcProvider(rpcEndpoint);
  const signer = new Wallet(privateKey, provider);
  return new TokenboundClient({ signer, chainId: chainId });
}


export const setTokenBoundAccountIsActive = async (tokenboundClient: any, tokenBoundAccount: string) => {
  return tokenboundClient.checkAccountDeployment({
    accountAddress: tokenBoundAccount as `0x${string}`
  });
}

export const setChainIdName = (id: number) => {
  const chainMap = {
    1: 'eth',
    5: 'goerli',
    11155111: 'sepolia',
    137: 'polygon',
    80001: 'mumbai',
    56: 'bsc'
  };
  // @ts-ignore
  return chainMap[id];
}

export const setTokenBoundAccount = (tokenboundClient: any, tokenContract: `0x${string}`, tokenId: `0x${string}`) => {
  return tokenboundClient.getAccount({ tokenContract, tokenId });
}

export const setTokenBoundNFTs = async (chainId: string, tba: string) => {
  try {
    // @ts-ignore
    const response = await fetch(
      `https://api.token-discovery.tokenscript.org/get-all-owner-tokens?chain=${chainId}&owner=${tba}&blockchain=evm`
    );
    return response.json();
  } catch (error) {
    console.log('error: ', error);
    return [];
  }
}