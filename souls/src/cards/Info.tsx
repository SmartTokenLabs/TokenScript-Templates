import { useEffect, useState } from 'react';
import { getNftPriceData } from '../lib/utils';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface TokenInfo {
  floorPrice: number;
  isLiveData: boolean;
  chain: string;
}

interface Token {
  name: string;
  contractAddress: string;
  chainId: number;
  image_preview_url?: string;
  external_link_open_graph_image?: string;
  tokenId: number;
  description?: string;
  tokenInfo?: {
    attributes?: Array<{ trait_type: string; value: string }>;
    type?: string;
  };
}

export interface RarityProps {
  token: Token;
}

// @ts-ignore
export const Info: React.FC = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [nftStats, setNftStats] = useState<TokenInfo | null>(null);

  useEffect(() => {
    if (token) {
      init();
      setLoading(false);
    }
  }, [token]);

  const init = async () => {
    await setNftPriceData();
  };

  const setNftPriceData = async () => {
    const nftPriceData = await getNftPriceData(token.contractAddress, token.chainId);
    setNftStats(nftPriceData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg m-6">
      <div className="my-6">
        <b>Collection</b>
      </div>
      <Card className="w-full mb-6">
        <CardContent className="mt-6 text-[#555555]">
          <p className="text-gray-500 font-normal text-sm py-1">
            Description
          </p>
          <p className="text-black text-sm pt-1 pb-4">
            A collection of 10,000 unique interactive art beings living on ethereum created by SiA and David OReilly. SOULS began as a series of simple colorful paintings that grew over time into an expansive collection of never before seen digital beings built with love and shaped between two friends. SOULS exist as virtual objects that can bounce, wiggle, dance, sleep, and even sing. Join the galaxy to see what we can create together!
          </p>
          {nftStats?.floorPrice && (
            <div>
              <p className="text-gray-500 font-normal text-sm py-1">
                Floor Price {nftStats.isLiveData ? '' : '(24hr)'}
              </p>
              <p className="text-black text-sm py-1">
                {`${nftStats.floorPrice} ${nftStats.chain.toUpperCase()}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full mb-6">
        <CardContent className="mt-6 text-[#555555] font-bold">
          Play
        </CardContent>
        <CardContent className="text-[#555555] text-center px-10">
          <Button asChild className="w-full bg-[#7a27e6] text-white">
            <a href="https://soulsgalaxy.io/" target="_blank">
              Souls Galaxy
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full mb-6">
        <CardContent className="mt-6 text-[#555555] font-bold">
          Buy
        </CardContent>
        <CardContent className="text-[#555555] text-center px-10">
          <Button asChild className="w-full bg-[#2081e2] text-white">
            <a href="https://opensea.io/collection/souls" target="_blank">
              OpenSea
            </a>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="w-full mb-6">
        <CardContent className="mt-6 text-[#555555] font-bold">
          Social
        </CardContent>
        <CardContent className="text-[#555555] text-center px-10">
          <Button asChild className="w-full bg-[#000000] text-white mb-4">
            <a href="https://twitter.com/souls_galaxy" target="_blank">
              X
            </a>
          </Button>
          <Button asChild className="w-full bg-[#5865f2] text-white">
            <a href="https://discord.com/invite/WUKF35W8Qb" target="_blank">
              Discord
            </a>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="w-full mb-6">
        <CardContent className="mt-6 text-[#555555] font-bold">
          Community Sharing
        </CardContent>
        <CardContent className="text-[#555555] text-left">
          This Tapp empowers Souls Galaxy holders to share their location and a brief message with the community. Use it to let others know your city, your travel spots, where to connect, or simply to share a fun update. What you share is entirely up to you!
        </CardContent>
      </Card>

    </div>
  );
};

