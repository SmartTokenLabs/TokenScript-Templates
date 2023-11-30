import type { CatListItem } from './data';
export type Token = {
	chainId: number;
	contractAddress: string;
	description: string;
	image_preview_url: string;
	label: string;
	name: string;
	ownerAddress: string;
	symbol: string;
	tokenId: string;
	contractOwner?: string;
};

export type ThreadItem = CatListItem & {
	unread: number;
	messages?: [];
	contract?: string;
	chainId?: string;
	wrongOwner: boolean;
	friendsSharedKey: string;
	yourSharedKey: string;
};
