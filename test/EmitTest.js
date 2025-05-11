const {time} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat")

describe("Lock", function () {
  it("Should emit withdrawal", async function () {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });
    await time.increaseTo(unlockTime);
    await expect(lock.withdraw()).to.emit(lock, "Withdrawal")
  });
});
