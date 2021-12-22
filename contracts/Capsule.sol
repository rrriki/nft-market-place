// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Capsule is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    address contractAddress;

    constructor(address marketPlaceAddress) ERC721("RK Capsules MarketPlace", "RK") {
        contractAddress = marketPlaceAddress;
    }

    function createCapsule(string memory tokenURI) public returns (uint) {
        tokenIds.increment();
        uint256 newCapsuleId = tokenIds.current();
        console.log("minting capsule %s resulted in tokenId %s", tokenURI, newCapsuleId);
        _mint(msg.sender, newCapsuleId);
        _setTokenURI(newCapsuleId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newCapsuleId;
    }
}