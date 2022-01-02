import React from "react";
import { NFTCard } from "../components";
import { NFTKind, useNFTs } from "../hooks/useNFTs";
export default function Dashboard() {
  const { isLoading, nfts, error } = useNFTs(NFTKind.CREATED);

  if (!isLoading && nfts.length === 0) {
    return <h1 className="py-10 px-20 text-3xl">No created assets</h1>;
  }

  const unsold = nfts.filter((nft) => !nft.sold);
  const sold = nfts.filter((nft) => nft.sold);

  return (
    <div className="p-4">
      <h2 className="text-2xl py-2">Created Assets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {unsold.map((nft, i) => (
          <NFTCard key={i} nft={nft} />
        ))}
      </div>

      {sold.length > 0 && (
        <React.Fragment>
          <hr />
          <h2 className="text-2xl py-2">Sold Assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {sold.map((nft, i) => (
              <NFTCard key={i} nft={nft} />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
