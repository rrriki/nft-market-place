import React from "react";
import { NFTCard } from "../components";
import { NFTKind, useNFTs } from "../hooks/useNFTs";

export default function Owned() {
  const { isLoading, nfts, error } = useNFTs(NFTKind.OWNED);

  if (!isLoading && nfts.length === 0) {
    return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>;
  }
  return (
    <div className="flex justify-center p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {nfts.map((nft, i) => (
          <NFTCard key={i} nft={nft} showDetail={true} />
        ))}
      </div>
    </div>
  );
}
