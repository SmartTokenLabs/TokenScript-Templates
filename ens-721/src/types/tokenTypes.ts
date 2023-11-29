export interface TokenInterface {
  [key: string]: string | number | undefined;
}

export let token: {
  nameExpires: number;
  name: string;
  ensName: string;
  renewalPricePerYear: number;
  description: string;
  image_preview_url?: string;
  avatar?: string;
  email?: string;
  keywords?: string;
  phone?: string;
  url?: string;
  display?: string;
  notice?: string;
  location?: string;
};

export function updateToken(newToken: Partial<typeof token>): void {
  token = { ...token, ...newToken };
}