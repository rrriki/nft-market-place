import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { NFT } from "../types";
import { useNFTs } from "../hooks/useNFTs";
import { CurrencyService, MarketService } from "../services";

export default function Home() {
    const { isLoading, nfts, error } = useNFTs();

  async function buyNFT(nft: NFT) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketService = new MarketService(signer);

      const price = CurrencyService.fromEtherToWei(nft.price);
      marketService.createMarketSale(nft.tokenId, price);
    } catch (error) {
      console.log(`ERROR buying NFT ${nft.name}`, { nft, error });
    }
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <h1 className="px-20 py-10 text-3xl">No items in the market place</h1>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 px-4">
        {nfts.map((nft, i) => (
          <div key={i} className="border shadow rounded-xl overflow-hidden">
            <img src={nft.image} />
            <div className="p-4">
              <p className="text-2xl font-semibold">{nft.name}</p>

              <div>
                <p className="text-gray-400">{nft.description}</p>
              </div>
            </div>

            <div className="p-4 bg-black">
              <p className="text-2xl mb-4 font-bold text-white">
                {nft.price} ETH
              </p>
              <button
                className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                onClick={() => buyNFT(nft)}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
