// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract MarketPlace is ReentrancyGuard {
  using Counters for Counters.Counter;

  Counters.Counter private itemIds;
  Counters.Counter private itemsSold;

  address payable private owner;
  uint256 private listingFee = 0.025 ether;

  constructor() {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint256 itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => MarketItem) private marketItemsById;

  event MarketItemCreated(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  function getListingFee() public view returns (uint256) {
    return listingFee;
  }

  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price cannot be zero");
    
    itemIds.increment();
    uint256 itemId = itemIds.current();

    marketItemsById[itemId] = MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)), // no-one
      price,
      false
    );

    // transfer ownsership to the marketplace
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  function createMarketSale(address nftContract, uint256 itemId)
    public
    payable
    nonReentrant
  {
    uint256 price = marketItemsById[itemId].price;
    uint256 tokenId = marketItemsById[itemId].tokenId;
    console.log('creating market sale for token %s for %s eth', tokenId, price);
    require(
      msg.value == price,
      "Please submit the asking price in order to complete the purchase"
    );

    marketItemsById[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    marketItemsById[itemId].owner = payable(msg.sender);
    marketItemsById[itemId].sold = true;
    itemsSold.increment();
    payable(owner).transfer(listingFee); // TODO: should be the price?
  }

  function fetchUnsoldItems() public view returns (MarketItem[] memory) {
    uint256 itemCount = itemIds.current();
    uint256 unsoldItemCount = itemIds.current() - itemsSold.current();
    uint256 currentIndex = 0;
    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        
    for (uint256 i = 1; i <= itemCount; i++) {
      MarketItem memory item = marketItemsById[i];
      if (item.owner == address(0)) {
        items[currentIndex] = item;
        currentIndex++;
      }
    }

    return items;
  }

  function fetchOwnedItems() public view returns (MarketItem[] memory) {
    uint256 itemCount = itemIds.current();
    uint256 currentIndex = 0;
    MarketItem[] memory items;
    for (uint256 i = 1; i <= itemCount; i++) {
      MarketItem memory item = marketItemsById[i];
      if (item.owner == msg.sender) {
        items[currentIndex] = item;
        currentIndex++;
      }
    }
        
    return items;
  }

  function fetchCreatedItems() public view returns (MarketItem[] memory) {
    uint256 itemCount = itemIds.current();
    uint256 currentIndex = 0;
    MarketItem[] memory items;
    for (uint256 i = 1; i <= itemCount; i++) {
      MarketItem memory item = marketItemsById[i];
      if (item.seller == msg.sender) {
       items[currentIndex] = item;
       currentIndex++;
      }
    }

    return items;
  }
}
