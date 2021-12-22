
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const MarketPlace = await ethers.getContractFactory("MarketPlace");
  const marketPlace = await MarketPlace.deploy();
  await marketPlace.deployed();
  console.log("# MarketPlace contract deployed to:", marketPlace.address);
  const Capsule = await ethers.getContractFactory("Capsule");
  const capsule = await Capsule.deploy(marketPlace.address);
  await capsule.deployed()
  console.log("# Capsule deployed contract to:", capsule.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
