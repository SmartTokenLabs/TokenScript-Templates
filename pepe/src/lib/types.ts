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
	contractOwner?: string;
	contractName?: string;
	contractURI?: string;
};

export type MessagesData = {
	unread?: number;
	messages?: [];
	friendsSharedKey: string;
	yourSharedKey: string;
};

export type Invite = {
	createdAt: string;
	sendingAddress: string;
};

export type Friend = {
	receivingAddress: string;
	receivingSharedKey?: string;
	sendingAddress: string;
	sendingSharedKey?: string;
};

type TokenCardData = {
	tokenName?: string;
};

export type ThreadItem = CatListItem & {
	contract?: string;
	chainId?: string;
	wrongOwner: boolean;
	tokenAddress:string
	friendAddress:string
} & MessagesData &
	TokenCardData;

export const TokenCardTypes = {
	Messages: 0,
	Friends: 1,
	Group: 2
};

