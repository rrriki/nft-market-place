import { Capsule__factory as CapsuleFactory } from "../../typechain/factories/Capsule__factory";
import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Configuration } from "../configuration";
import { Capsule } from "../../typechain/Capsule";

export class CapsuleService {
  private instance: Capsule;

  constructor(
    signerOrProvider: Provider | Signer = new ethers.providers.JsonRpcProvider()
  ) {
    const capsuleContractAddress = Configuration.getCapsuleContractAddress();
    const capsuleContract = CapsuleFactory.connect(
      capsuleContractAddress,
      signerOrProvider
    );
    this.instance = capsuleContract;
  }

  public getTokenUri = async (tokenId: number) => {
    return await this.instance.tokenURI(tokenId);
  };

  public createCapsule = async (dataUrl: string): Promise<number> => {
    const capsule = await this.instance.createCapsule(dataUrl);
    const transaction = await capsule.wait();
    const [event] = transaction.events;
    console.log("created capsule", { event });
    const value = event.args[2]; // TODO: what are the other 2?
    const tokenId = value.toNumber();
    return tokenId;
  };
}
