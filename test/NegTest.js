const {time} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat")

describe("Lock", function () {
  it("Should revert with the right error if called too soon", async function () {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });
    await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
  });
});