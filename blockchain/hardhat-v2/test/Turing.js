//import TokenArtifact from "./../artifacts/contracts/Turing.sol/TuringToken.json" with { type: "json" };
const TokenArtifact = require("./../artifacts/contracts/Turing.sol/TuringToken.json");


const { expect } = require("chai");

//https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers we
//need to add a sort of hook-package to connect hardhat and ethers. This
//module does just that and adds an 'ethers' object in the global environment.
//Therefore we dont actually need to require it. Anyway, this 'ethers' object
//is actually an enhanced version of what we would get from
//'require('ethers')', and has additional methods (such as deployContract)
const { ethers } = require("hardhat");
//const { ethers } = require("ethers");

describe("Turing contract", function () {
  it("The owner should be able to send 3*10**-18 turings to the first address of the blockchain", async function () {
    const url = 'http://localhost:8545';
    const amount = 3000000000;
    //const [owner] = await ethers.getSigners();
    const provider = new ethers.JsonRpcProvider(url)
    const receiver = await provider.getSigner(2); //returns the third address available
    const turingContract = await ethers.deployContract("TuringToken");

    //the following also works and its actually the way 'ethers' recommends
    //instantiating the contract, but we need additional parameters for that:
    //https://docs.ethers.org/v6/getting-started/
    //const contractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    //provider isn't a good runner lmao
    //const turingContract = await new ethers.Contract(contractAddr, TokenArtifact.abi, provider);
    //const turingContract = await new ethers.Contract(contractAddr, TokenArtifact.abi, provider.getSigner());

    await turingContract.issueToken(receiver, amount);
    const receiverAddr = await receiver.getAddress();
    // const receiverBalance = await provider.getBalance(receiverAddr);
    const receiverTuringBalance = await turingContract.balanceOf(receiverAddr);
    expect(receiverTuringBalance).to.equal(BigInt(amount));
  });
});
