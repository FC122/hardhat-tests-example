const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("SimpleStorage", function () {
    async function deploySimpleStorageFixture(){
        const [owner] = await ethers.getSigners();
        const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
        const simpleStorage = await SimpleStorage.deploy();
        return {owner, simpleStorage}
    }

  it("Should return the initial stored value of 0", async function () {
    const {simpleStorage} = await loadFixture(deploySimpleStorageFixture)
    expect(await simpleStorage.get()).to.equal(0);
  });

  it("Should store the value 42", async function () {
    const {simpleStorage} = await loadFixture(deploySimpleStorageFixture)
    await simpleStorage.set(42);
    expect(await simpleStorage.get()).to.equal(42);
  });

  it("Should store the value 100", async function () {
    const {simpleStorage} = await loadFixture(deploySimpleStorageFixture)
    await simpleStorage.set(100);
    expect(await simpleStorage.get()).to.equal(100);
  });
});