import { ethers } from "ethers";

export class CurrencyService {
  public static fromEtherToWei(amount: number): ethers.BigNumber {
    return ethers.utils.parseUnits(amount.toString(), "ether");
  }

  public static fromWeiToEther(amount: ethers.BigNumber): number {
    return +ethers.utils.formatUnits(amount, "ether");
  }
}
