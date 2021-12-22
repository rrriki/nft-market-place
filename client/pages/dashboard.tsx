import React from "react";
import { NFTKind, useNFTs } from "../hooks/useNFTs";
export default function Dashboard() {
  const { isLoading, nfts, error } = useNFTs(NFTKind.CREATED);

  if (!isLoading && nfts.length === 0) {
    return <h1 className="py-10 px-20 text-3xl">No created assets</h1>;
  }

  const soldItems = nfts.reduce((acc, curr, index, arr) => {
    if (curr.sold) {
      acc.push(curr);
      arr.splice(index, 1);
    }
    return acc;
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl py-2">Created Assets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {nfts.map((nft, i) => (
          <div key={i} className="border shadow rounded-xl overflow-hidden">
            <img src={nft.image} className="rounded" />
            <div className="p-4 bg-black">
              <p className="text-2xl font-bold text-white">
                Price - {nft.price} ETH
              </p>
            </div>
          </div>
        ))}
      </div>

      {soldItems.length > 0 && (
        <React.Fragment>
          <hr />
          <h2 className="text-2xl py-2">Sold Assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {soldItems.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    Price - {nft.price} ETH
                  </p>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
