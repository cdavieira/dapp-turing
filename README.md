# dApp
'react' for the frontend

'ethers.js' and 'hardhat' to interact with the blockchain and with the
providers (wallets such as metamask and so on)

'chai' for testing

'ignition' for deploying (this is related to hardhat aswell)


## how to run this app
```
yarn
yarn exec hardhat compile
rm -rf ./ignition/deployments/chain-1337/
yarn exec hardhat node &
yarn run deploy
# !!!!! confirm the deploy by typing 'y' !!!!!
cp ./artifacts/contracts/Turing.sol/TuringToken.json ./frontend/src
cd frontend/
yarn
yarn run start
```

then open <http://localhost:3000> in your favorite browser and try it out :)



## how to redeploy the contract?
```
rm -rf ./ignition/deployments/chain-1337/
yarn run deploy
cp ./artifacts/contracts/Turing.sol/TuringToken.json ./frontend/src
```

if you don't do that after restarting the local blockchain, then you will face
[this error](https://ethereum.stackexchange.com/questions/161483/polygon-zkevm-get-token-balance-error-could-not-decode-result-data)



## how to redeploy the contract to a different network?
change the `defaultNetwork: "localhost"` option from `hardhart.config.js` to
something else and redeploy




## references
Metamask
* [how to connect metamask to a json provider - Metamask](https://docs.metamask.io/wallet/how-to/run-devnet/)
* [Provider - Metamask](https://docs.metamask.io/wallet/reference/provider-api/)

Hardhat
* [Tutorial 1 - Hardhat org](https://hardhat.org/tutorial/creating-a-new-hardhat-project)
* [Tutorial 2 - Hardhat org](https://hardhat.org/hardhat-runner/docs/getting-started#overview)
* [Hardhat-Ethers bridge](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers)

Solidity
* [Introduction to smart contracts - SolidityLang](https://docs.soliditylang.org/en/v0.8.9/introduction-to-smart-contracts.html)

Ethers
* [Getting Started Ethers V6 - Ethers org](https://docs.ethers.org/v6/getting-started/)
* [Getting Started Ethers V5 - Ethers org](https://docs.ethers.org/v5/getting-started/)

Others
* <https://stackoverflow.com/questions/69971218/what-is-the-difference-between-msg-sender-and-addressthis>

Labs
* [Lab 12](https://jamesbachini.com/solidity-for-beginners/)
* [Lab 13](https://vitto.cc/how-to-create-and-deploy-an-erc20-token-in-20-minutes/)
* [Lab 14](https://pt.w3d.community/fatimalima/como-construir-seu-dapp-usando-a-moderna-ethereum-tech-stack-hardhat-e-ethersjs-20n7)
