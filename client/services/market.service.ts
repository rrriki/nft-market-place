import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { MarketPlace__factory as MarketPlaceFactory } from "../../typechain/factories/MarketPlace__factory";
import { MarketPlace } from "../../typechain/MarketPlace";
import { Configuration } from "../configuration";

export class MarketService {
  private instance: MarketPlace;

  constructor(
    signerOrProvider: Provider | Signer = new ethers.providers.JsonRpcProvider()
  ) {
    const marketContractAddress = Configuration.getMarketContractAddress();
    const marketPlaceContract = MarketPlaceFactory.connect(
      marketContractAddress,
      signerOrProvider
    );
    this.instance = marketPlaceContract;
  }
  public fetchUnsoldItems = async () => {
    return await this.instance.fetchUnsoldItems();
  };

  public fetchOwnedItems = async () => {
    return await this.instance.fetchOwnedItems();
  };

  public fetchCreatedItems = async () => {
    return await this.instance.fetchCreatedItems();
  };

  public createMarketItem = async (
    tokenId: number,
    price: ethers.BigNumber
  ) => {
    const capsuleContractAddress = Configuration.getCapsuleContractAddress();
    const item = await this.instance.createMarketItem(
      capsuleContractAddress,
      tokenId,
      price
    );
    await item.wait();
  };

  public createMarketSale = async (
    tokenId: number,
    price: ethers.BigNumber
  ) => {
    const capsuleContractAddress = Configuration.getCapsuleContractAddress();
    const transaction = await this.instance.createMarketSale(
      capsuleContractAddress,
      tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
  };
}
