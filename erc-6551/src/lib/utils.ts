import { error } from '@sveltejs/kit';
import { TokenboundClient } from '@tokenbound/sdk';

export const getTokenBoundClientInstance = (chainId: number) => {
  return new TokenboundClient({
    chainId: chainId,
    // @ts-ignore
    publicClientRPCUrl: window.rpcURL, // global TS engine variable of RPC for connected chain
  });
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

export const setTokenBoundCollectables = async (chainId: string, tba: string) => {
  try {
    const response = await fetch(
      `https://api.token-discovery.tokenscript.org/get-all-owner-tokens?chain=${chainId}&owner=${tba}&blockchain=evm`
    );
    return response.json();
  } catch (error) {
    console.log('error: ', error);
    return [];
  }
}

export const setTokenBoundAssets = async (chainId: string, tba: string) => {
  try {
    const response = await fetch(
      `https://api.token-discovery.tokenscript.org/get-owner-fungible-tokens?blockchain=${chainId}&owner=${tba}&chain=eth`
    );
    const responseJson = await response.json();
    if (responseJson.error) {
      console.log('error: ', error);
      return [];
    }
    return responseJson;
  } catch (error) {
    console.log('error: ', error);
    return [];
  }
}
