/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-ignition-ethers");


module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 1337, // Matches the Hardhat node chain ID
    }, // In-process network
    localhost: {
      url: "http://127.0.0.1:8545", // The local Hardhat node
      chainId: 1337, // Matches the Hardhat node chain ID
    },
  }
};
