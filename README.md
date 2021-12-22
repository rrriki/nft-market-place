# NFT Market Place

This is a pet project to create an NFT market place. It uses [Solidity](https://docs.soliditylang.org) to write the smart contracts, leveraging Typescript with [Hardhat](https://hardhat.org/).

It includes a small UI written with React to display and interact with the items in the market place.


Items in the MarketPlace (`Capsules`) are tokens based on the ERC721 standard, which include attributes and assets stored in the [IPFS](https://ipfs.io/).
 
## Getting started

Once you've cloned the repository, you'd want to install the dependencies and compile the contracts using hardhat.

```sh
$ npm install
$ npx hardhat compile
```
That will generate the artifacts and types needed to deploy the contracts.

>Inside the `hardhat.config.ts` are the configurations for deployment. The project is configured to be deployed through [Infura](https://infura.io/) to Polygon's Mumbai test network, and mainnet, but you'll need to add/update an `.env` file, with a project `INFURA_PROJECT_ID` and  `METAMASK_PRIVATE_KEY`

using hardhat you can run a node, 

```sh
$ npx hardhat node
```
And then deploy the contracts there, locally 

```sh
$ npx hardhat run scripts/deploy.ts --network localhost
```

The deployment script, will output the address for each contract, which you'll need to copy and paste to update the frontend environment variables inside `client/.env.local`

```
NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS=XXXXXXXXXX
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=YYYYYYYYYY
```
After that, you should be able to install the dependencies and start the frontend 
```sh
$ cd client
$ npm install
$ npm run dev
```

## License
[GPL 3.0](https://choosealicense.com/licenses/gpl-3.0/)
