import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { MarketService } from "../services/market.service";
import { CapsuleService } from "../services/capsule.service";
import { CurrencyService } from "../services";
import { NFT } from "../types";
import { ethers } from "ethers";

export enum NFTKind {
  UNSOLD = "UNSOLD",
  OWNED = "OWNED",
  CREATED = "CREATED",
}

export function useNFTs(kind: NFTKind = NFTKind.UNSOLD) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchNfts = async () => {
    setIsLoading(true);
    setError(null);

    const capsuleService = new CapsuleService();

    try {
      let data: {
        itemId: ethers.BigNumber;
        nftContract: string;
        tokenId: ethers.BigNumber;
        seller: string;
        owner: string;
        price: ethers.BigNumber;
        sold: boolean;
      } & any;
      
      switch (kind) {
        case NFTKind.UNSOLD: {
          const marketService = new MarketService();
          data = await marketService.fetchUnsoldItems();
          console.log("fetched market unsold items", data);
          break;
        }

        case NFTKind.OWNED: {
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          const signer = provider.getSigner();
          const marketService = new MarketService(signer);
          data = await marketService.fetchOwnedItems();
          console.log("fetched market owned items", data);
          break;
        }

        case NFTKind.CREATED: {
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          const signer = provider.getSigner();
          const marketService = new MarketService(signer);
          data = await marketService.fetchCreatedItems();
          console.log("fetched market created items", data);
          break;
        }

        default: {
          console.log("unknown NFT kind, omitting fetch");
          return;
        }
      }

      const items = await Promise.all(
        data.map(async (item) => {
          const tokenUri = await capsuleService.getTokenUri(
            item.tokenId.toNumber()
          );
          const meta = await axios.get(tokenUri);
          const price = CurrencyService.fromWeiToEther(item.price);
          return {
            price,
            tokenId: item.tokenId.toNumber(),
            seller: item.seller,
            owner: item.owner,
            sold: item.sold,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            attributes: meta.data.attributes,
          };
        })
      );
      setNfts(items);
    } catch (error) {
      console.log(`ERROR fetching ${kind} NFT items`, { error });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, []);

  return { isLoading, nfts, error };
}
