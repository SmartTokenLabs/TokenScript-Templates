import { useEffect, useState } from 'react';
import { getNftPriceData } from '../lib/utils';
import { Card, CardContent, CardHeader } from '../components/ui/card';

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

interface RarityData {
	traitRarity: { value: string; type: string; percentage: number }[];
}

export interface RarityProps {
	token: Token;
}

// @ts-ignore
export const Info: React.FC = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [collectionName, setCollectionName] = useState('');
  const [imageFailedToLoad, setImageFailedToLoad] = useState(false);
  const [nftStats, setNftStats] = useState<TokenInfo | null>(null);
  const [rarityData, setRarityData] = useState<RarityData>({ traitRarity: [] });

  useEffect(() => {
    if (token) {
      init();
      setLoading(false);
    }
  }, [token]);

  const init = async () => {
    setCollectionName(
      token.name.includes('#') ? token.name.split('#')[0] : token.name
    );
    await setNftPriceData();

	const apiUrl = "http://localhost:3000/get-token-rarity?smartContract=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&chain=eth&tokenId=5202";
	const rarityReq = await fetch(apiUrl);
	const rarityJson = await rarityReq.json();
	setRarityData(rarityJson);
			
  };

  const setNftPriceData = async () => {
    const nftPriceData = await getNftPriceData(token.contractAddress, token.chainId);
    setNftStats(nftPriceData);
	  console.log(nftPriceData, 'YYYY');
  };

  const handleImageError = () => setImageFailedToLoad(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {token.external_link_open_graph_image && (
        <img
          className="w-full rounded-lg"
          crossOrigin="anonymous"
          src={token.external_link_open_graph_image}
          alt="hero image"
        />
      )}
      <div className="flex justify-between items-center bg-white rounded-lg h-36 mt-4 mb-2 p-5">
        <div className="w-1/2">
          <h3 className="text-lg mb-2 break-words">{token.name}</h3>
          <p className="text-gray-600 text-sm">{token.tokenId ? `#${token.tokenId}` : `${collectionName}`}</p>
        </div>
        <div>
          {!token.image_preview_url || imageFailedToLoad ? (
            <div className="border rounded-lg p-8 text-sm text-gray-500 border-gray-300 h-24 w-24">
              No image found.
            </div>
          ) : (
            <img
              className="rounded-lg h-24 w-24"
              src={token.image_preview_url}
              alt={token.name}
              onError={handleImageError}
            />
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg p-5">
		<Card className="w-full mb-6">
			<CardContent className="mt-6 text-[#555555] font-bold text-center">
				Token Traits
			</CardContent>
		</Card>
		<div className="flex flex-wrap justify-between gap-x-4 gap-y-4">
			{rarityData.traitRarity.map((item, index) => (
				<Card key={index} className="text-center flex-1 min-w-[200px] p-4 text-center rounded-lg text-[#555555]">
					<CardHeader className="pb-1 text-sm">
						<p>{item.type}</p>
					</CardHeader>
					<CardContent className="py-1 text-sm">{item.value}</CardContent>
					<CardContent className="pt-1 text-sm font-bold">
						{item.percentage.toFixed(2)}%
					</CardContent>
				</Card>
			))}
		</div>
		<Card className="w-full my-6">
			<CardContent className="mt-6 text-[#555555] font-bold text-center">
				Collection
			</CardContent>
			<CardContent className="mt-6 text-[#555555] text-center">
				{token.description}
			</CardContent>
			{nftStats?.floorPrice && (
				<CardContent className="mt-6 text-[#555555] text-center">
					<p className="text-gray-500 font-normal text-sm py-1">
						Token Floor Price {nftStats.isLiveData ? '' : '(24hr)'}
					</p>
					<p className="text-black text-sm py-1">
						{`${nftStats.floorPrice} ${nftStats.chain.toUpperCase()}`}
					</p>
				</CardContent>
			)}
		</Card>
      </div>
    </div>
  );
};

