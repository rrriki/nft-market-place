import { expect } from "chai";
import { ethers } from "hardhat";

describe("MarketPlace", function () {
  it("Should create and execute market sale", async function () {
    const Market = await ethers.getContractFactory("MarketPlace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const Capsule = await ethers.getContractFactory("Capsule");
    const capsule = await Capsule.deploy(marketAddress);
    await capsule.deployed();
    const capsuleAddress = capsule.address;

    let listingFee = (await market.getListingFee()).toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await capsule.createCapsule("https://riki.rocks/token1");

    await capsule.createCapsule("https://riki.rocks/token2");

    await market.createMarketItem(capsuleAddress, 1, auctionPrice, {
      value: listingFee,
    });
    await market.createMarketItem(capsuleAddress, 2, auctionPrice, {
      value: listingFee,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    await market
      .connect(buyerAddress)
      .createMarketSale(capsuleAddress, 1, { value: auctionPrice });

    const items = await market.fetchUnsoldItems();

    const parsedItems = await Promise.all(
      items.map(async (item) => {
        const tokenId = item.tokenId.toString();
        const tokenUri = await capsule.tokenURI(item.tokenId);
        return {
          price: item.price.toString(),
          tokenId,
          sellecr: item.seller,
          owner: item.owner,
          tokenUri,
        };
      })
    );

    expect(items.length).to.equal(1);
    expect(parsedItems[0].tokenUri).to.equal("https://riki.rocks/token2");
    expect(parsedItems[0].tokenId).to.equal("2");
    expect(parsedItems[0].price).to.equal(auctionPrice);
  });
});
