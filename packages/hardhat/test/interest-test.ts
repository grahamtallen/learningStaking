//
// This script executes when you run 'yarn test'
//
import { ethers } from "hardhat";
import { expect } from "chai";
import { ExampleExternalContract, Staker } from "../typechain-types";

describe("Interest calculation", function () {
  let exampleExternalContract: ExampleExternalContract;
  let stakerContract: Staker;

  describe("Staker", function () {
    const contractAddress = process.env.CONTRACT_ADDRESS;

    let contractArtifact: string;
    if (contractAddress) {
      // For the autograder.
      contractArtifact = `contracts/download-${contractAddress}.sol:Staker`;
    } else {
      contractArtifact = "contracts/Staker.sol:Staker";
    }

    it("Should deploy ExampleExternalContract", async function () {
      const ExampleExternalContract = await ethers.getContractFactory("ExampleExternalContract");
      exampleExternalContract = await ExampleExternalContract.deploy();
    });
    it("Should deploy Staker", async function () {
      const Staker = await ethers.getContractFactory(contractArtifact);
      stakerContract = (await Staker.deploy(await exampleExternalContract.getAddress())) as Staker;
      console.log("\t", "🛰  Staker contract deployed on", await stakerContract.getAddress());
    });
    describe("stake with interest", function () {
      it("Timestamp mapping", async function () {
        const [owner] = await ethers.getSigners();

        console.log("\t", " 🧑‍🏫 Tester Address: ", owner.address);

        const startingBalance = await stakerContract.balances(owner.address);
        console.log("\t", " ⚖️ Starting balance: ", Number(startingBalance));
        const blockNum = await ethers.provider.getBlockNumber();
        const block = await ethers.provider.getBlock(blockNum);
        console.log("Block timestamp:", block?.timestamp);

        console.log("\t", " 🔨 Staking...");
        const stakeResult = await stakerContract.stake({ value: ethers.parseEther("0.001") });
        console.log("\t", " 🏷  stakeResult: ", stakeResult.hash);

        console.log("\t", " ⏳ Waiting for confirmation...");
        const txResult = await stakeResult.wait();
        expect(txResult?.status).to.equal(1);

        const timestamp = await stakerContract.depositTimestamps(owner.address);
        console.log("\t", " 🔎 depositTimestamp", timestamp);
        expect(timestamp).to.equal(block?.timestamp);
      });
    });
  });
});
