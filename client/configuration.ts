import { Options } from "ipfs-http-client";

export class Configuration {
  public static getCapsuleContractAddress = (): string => {
    return process.env["NEXT_PUBLIC_NFT_CONTRACT_ADDRESS"];
  };

  public static getMarketContractAddress = (): string => {
    return process.env["NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS"];
  };

  public static getIpfsClientOptions(): Options {
    return {
      // url: 'https://ipfs.infura.io:5001/api/v0'
      protocol: "https",
      host: "ipfs.infura.io",
      port: 5001,
      apiPath: "api/v0",
    };
  }

  public static getIpfsFileUrl = (CID: string) => {
    return `https://ipfs.infura.io/ipfs/${CID}`;
  };
}
