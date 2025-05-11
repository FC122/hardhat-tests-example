const {time, loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Lock", function () {
    async function deployOneYearLockFixture() {
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const ONE_GWEI = 1_000_000_000;
    
        const lockedAmount = ONE_GWEI;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
    
        const Lock = await ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
    
        return { lock, unlockTime, lockedAmount, owner, otherAccount };
    }

  it("Should set the right unlockTime", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

  it("Should revert with the right error if called too soon", async function () {
    const { lock } = await loadFixture(deployOneYearLockFixture);
    await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
  });

  it("Should transfer the funds to the owner", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
    await time.increaseTo(unlockTime);
    await expect(lock.withdraw()).not.to.be.reverted;
  });

  it("Should emit withdrawal", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
    await time.increaseTo(unlockTime);
    await expect(lock.withdraw()).to.emit(lock, "Withdrawal")
  });

  it("Should emit withdrawal", async function () {
    const { lock, unlockTime, owner, lockedAmount } = await loadFixture(deployOneYearLockFixture);
    await time.increaseTo(unlockTime);
    await expect(lock.withdraw()).to.changeEtherBalance(
        owner, lockedAmount)
    });
});
  