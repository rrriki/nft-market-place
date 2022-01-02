import React from "react";
import { NFT } from "../../types";

interface NFTCardProps {
  nft: NFT;
  showDetail?: boolean;
  onBuy?: (nft: NFT) => void;
}

export const NFTCard: React.FC<NFTCardProps> = (props) => {
  const { nft, showDetail, onBuy } = props;
  return (
    <div className="border shadow rounded-xl overflow-hidden">
      <img src={nft.image} className="rounded" />
      {showDetail && (
        <div className="p-4">
          <p className="text-2xl font-semibold">{nft.name}</p>
          <p className="text-gray-400">{nft.description}</p>
        </div>
      )}
      <div className="p-4 bg-black">
        <p className="text-2xl font-bold text-white">Price - {nft.price} ETH</p>
        {onBuy && (
          <button
            className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
            onClick={() => onBuy(nft)}
          >
            Buy
          </button>
        )}
      </div>
    </div>
  );
};
