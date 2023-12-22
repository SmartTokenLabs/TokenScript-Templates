import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC6672", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployERC6672() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account2, account3, account4, account5 ] = await ethers.getSigners();

    const ERC6672 = await ethers.getContractFactory("ERC6672");
    const erc6672 = await ERC6672.deploy();

    return { erc6672, owner, account2, account3, account4, account5 };
  }

  it("Validate owner", async function () {
    const { erc6672, owner } = await loadFixture(deployERC6672);

    expect(await erc6672.owner()).to.equal(owner.address);
  });

  it("Set Operator", async function () {
    const { erc6672, owner, account2, account3 } = await loadFixture(deployERC6672);

    await expect(erc6672.connect(account2).addOperator(account2.address)).to.revertedWithCustomError(
      erc6672, 
      'OwnableUnauthorizedAccount'
    );

    await expect(erc6672.addOperator(account2.address)).to.emit(erc6672, "AddedOperator")
    await expect(erc6672.addOperator(account3.address)).to.emit(erc6672, "AddedOperator")
    expect( await erc6672.getOperators()).to.deep.equal([account2.address, account3.address])
    
    await expect(erc6672.removeOperator(account2.address)).to.emit(erc6672, "RemovedOperator")
    expect( await erc6672.getOperators()).to.deep.equal([ account3.address])

  });

  it("Mint and redeem", async function () {
    const { erc6672, owner, account2, account3 } = await loadFixture(deployERC6672);
    await erc6672.connect(owner).mint(account2.address);
    await expect(erc6672.addOperator(account3.address)).to.emit(erc6672, "AddedOperator")
    await expect( erc6672.connect(account2).redeem(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 1, "")).to.revertedWithCustomError(erc6672, "AccessControlUnauthorizedAccount")
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 1, "")).to.revertedWithCustomError(erc6672, "ERC721NonexistentToken")
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 0, "memo1")).to.emit(erc6672, "Redeem")

  });

  it("Multiple redeem", async function () {
    const { erc6672, owner, account2, account3, account4, account5 } = await loadFixture(deployERC6672);
    await erc6672.connect(owner).mint(account2.address);
    await erc6672.connect(owner).mint(account3.address);
    await erc6672.connect(owner).mint(account4.address);
    
    await expect(erc6672.addOperator(account3.address)).to.emit(erc6672, "AddedOperator")
    
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 0, "memo1")).to.emit(erc6672, "Redeem")
    // await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 0, "memo1")).to.revertedWithCustomError(erc6672, "AlreadyRedeemed")
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([1]), 32), 0, "memo2")).to.emit(erc6672, "Redeem")
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 1, "memo3")).to.emit(erc6672, "Redeem")
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([1]), 32), 1, "memo3")).to.emit(erc6672, "Redeem")
    
    await expect( erc6672.getRedemptionIds(account2.address, 1)).to.revertedWithCustomError(erc6672, "NotAnOperator")
    expect( await erc6672.getRedemptionIds(account3.address, 1)).to.deep.equal([
      ethers.zeroPadBytes(Uint8Array.from([0]), 32),
      ethers.zeroPadBytes(Uint8Array.from([1]), 32)
    ])


  });

  it("Cancel redeem", async function () {
    const { erc6672, owner, account2, account3, account4, account5 } = await loadFixture(deployERC6672);
    await erc6672.connect(owner).mint(account2.address);
    
    await expect(erc6672.addOperator(account3.address)).to.emit(erc6672, "AddedOperator")
    
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 0, "memo1")).to.emit(erc6672, "Redeem")
    // await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 0, "memo1")).to.revertedWithCustomError(erc6672, "AlreadyRedeemed")
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([1]), 32), 0, "memo2")).to.emit(erc6672, "Redeem")
    await expect ( erc6672.connect(account3).redeem(ethers.zeroPadBytes(Uint8Array.from([2]), 32), 0, "memo2")).to.emit(erc6672, "Redeem")
    
    expect( await erc6672.getRedemptionIds(account3.address, 0)).to.deep.equal([
      ethers.zeroPadBytes(Uint8Array.from([0]), 32),
      ethers.zeroPadBytes(Uint8Array.from([1]), 32),
      ethers.zeroPadBytes(Uint8Array.from([2]), 32)
    ])
    
    await expect ( erc6672.connect(account3).cancel(ethers.zeroPadBytes(Uint8Array.from([0]), 32), 0, "canceled1")).to.emit(erc6672, "Cancel")

    expect( await erc6672.getRedemptionIds(account3.address, 0)).to.deep.equal([
      ethers.zeroPadBytes(Uint8Array.from([1]), 32),
      ethers.zeroPadBytes(Uint8Array.from([2]), 32)
    ])

    await expect ( erc6672.connect(account3).cancel(ethers.zeroPadBytes(Uint8Array.from([1]), 32), 0, "canceled1")).to.emit(erc6672, "Cancel")
    await expect ( erc6672.connect(account3).cancel(ethers.zeroPadBytes(Uint8Array.from([2]), 32), 0, "canceled1")).to.emit(erc6672, "Cancel")

    expect( await erc6672.getRedemptionIds(account3.address, 0)).to.deep.equal([])
  });

  it("Enumerable", async function () {
    const { erc6672, owner, account2 } = await loadFixture(deployERC6672);

    await expect(erc6672.connect(owner).mint(account2.address)).to.emit(erc6672, "Transfer");

    expect(await erc6672.balanceOf(account2.address)).to.eq(1);
    expect(await erc6672.totalSupply()).to.eq(1);
    expect(await erc6672.tokenByIndex(0)).to.eq(0);
    expect(await erc6672.tokenOfOwnerByIndex(account2.address, 0)).to.eq(0);
  });

  it("Enumerable + Burn", async function () {
    const { erc6672, owner, account2, account3 } = await loadFixture(deployERC6672);

    await expect(erc6672.connect(owner).mint(account2.address)).to.emit(erc6672, "Transfer");
    await expect(erc6672.connect(owner).mint(account2.address)).to.emit(erc6672, "Transfer");
    await expect(erc6672.connect(owner).mint(account3.address)).to.emit(erc6672, "Transfer");
    await expect(erc6672.connect(owner).mint(account2.address)).to.emit(erc6672, "Transfer");
    await expect(erc6672.connect(account2).burn(1)).to.emit(erc6672, "Transfer");

    expect(await erc6672.balanceOf(account2.address)).to.eq(2);
    expect(await erc6672.totalSupply()).to.eq(3);
    expect(await erc6672.tokenByIndex(1)).to.eq(2);
    expect(await erc6672.tokenOfOwnerByIndex(account2.address, 1)).to.eq(3);
  });

  it("ERC721 supportInterface", async function () {
    const { erc6672, account2, account3, owner } = await loadFixture(deployERC6672);

    const ERC721InterfaceId = "0x80ac58cd";
    expect(await erc6672.supportsInterface(ERC721InterfaceId)).to.eq(true);
  });

  it("setScriptURI", async () => {
    const { erc6672, account2, owner } = await loadFixture(deployERC6672);

    expect(await erc6672.scriptURI()).to.eql([]);

    // await expect(erc6672.connect(account2).setScriptURI([])).to.revertedWith('OwnableUnauthorizedAccount("'+account2.address+'")');
    await expect(erc6672.connect(account2).setScriptURI([])).to.revertedWithCustomError(erc6672, 'OwnableUnauthorizedAccount').withArgs(account2.address);

    const scriptURI = ["uri1", "uri2", "uri3"];

    await expect(erc6672.connect(owner).setScriptURI(scriptURI)).to.emit(erc6672, "ScriptUpdate").withArgs(scriptURI);

    expect(await erc6672.scriptURI()).to.eql(scriptURI);
  });

  it("supportsInterface ERC5169", async function () {
    const { erc6672 } = await loadFixture(deployERC6672);

    const ERC5169InterfaceId = "0xa86517a1";

    expect(await erc6672.supportsInterface(ERC5169InterfaceId)).to.eq(true);
  });

  it("isOwner", async function () {
    const { erc6672, owner } = await loadFixture(deployERC6672);


    expect(await erc6672.hasRole(ethers.ZeroHash ,owner.address)).to.eq(true);
  });


});
