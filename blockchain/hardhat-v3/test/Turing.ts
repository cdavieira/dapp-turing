import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("Counter", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();

  it("Should emit the Voted event when calling the vote() function", async function () {
    // const turing = await viem.deployContract("LocalTuring");

    // await viem.assertions.emitWithArgs(
    //   turing.write.vote(["nome3", 10n]),
    //   turing,
    //   "Voted",
    //   [addr1, 10n, "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"],
    // );
  });

  it("The sum of the Increment events should match the current value", async function () {
    // const counter = await viem.deployContract("LocalTuring");
    // const deploymentBlockNumber = await publicClient.getBlockNumber();

    // run a series of increments
    // for (let i = 1n; i <= 10n; i++) {
    //   await counter.write.incBy([i]);
    // }

    // const events = await publicClient.getContractEvents({
    //   address: counter.address,
    //   abi: counter.abi,
    //   eventName: "Increment",
    //   fromBlock: deploymentBlockNumber,
    //   strict: true,
    // });

    // check that the aggregated events match the current value
    // let total = 0n;
    // for (const event of events) {
    //   total += event.args.by;
    // }

    // assert.equal(total, await counter.read.x());
  });
});
