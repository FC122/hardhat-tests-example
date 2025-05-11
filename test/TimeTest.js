const {time} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat")

describe("Should not revert if time has past", function () {
  it("Should transfer the funds to the owner", async function () {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });
    await time.increaseTo(unlockTime);
    await expect(lock.withdraw()).not.to.be.reverted;
  });
});
