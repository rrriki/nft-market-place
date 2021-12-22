type Attributes = {
  name: string;
  value: string | number;
};

export interface NFT {
  price: number;
  tokenId: number;
  seller: string;
  sold: boolean;
  owner: string;
  image: string;
  name: string;
  description: string;
  attributes: Attributes[];
}

export type NFTFormValues = {
  image: string;
  name: string;
  description: string;
  price: number;
  attributes: Attributes[];
};
