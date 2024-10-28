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
            {token.description}
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
          Buy Tokens
        </CardContent>
        <CardContent className="text-[#555555] text-center px-10">
          {/* <Button asChild className="mb-4 w-full bg-[#ff6c5a] text-white">
            <a href="https://mooar.com/collection/souls/" target="_blank" rel="noopener noreferrer">
              Buy from Mooar
            </a>
          </Button> */}
          <Button asChild className="w-full bg-[#2081e2] text-white">
            <a href="https://opensea.io/collection/souls" target="_blank" rel="noopener noreferrer">
              Buy from OpenSea
            </a>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
};

