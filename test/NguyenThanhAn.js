const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NguyenThanhAn", function () {
    let MyNameToken;
    let myNameToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        MyNameToken = await ethers.getContractFactory("NguyenThanhAn");
        [owner, addr1, addr2] = await ethers.getSigners();
        myNameToken = await MyNameToken.deploy();
        await myNameToken.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await myNameToken.owner()).to.equal(owner.address);
        });

        it("Should have the correct total supply", async function () {
            const totalSupply = await myNameToken.totalSupply();
            expect(totalSupply).to.equal(ethers.utils.parseUnits("100000", 18));
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await myNameToken.transfer(addr1.address, 100);
            const addr1Balance = await myNameToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await myNameToken.balanceOf(owner.address);
            await expect(
                myNameToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
            expect(await myNameToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it("Should update balances after transfers", async function () {
            await myNameToken.transfer(addr1.address, 100);
            await myNameToken.transfer(addr2.address, 50);
            const addr1Balance = await myNameToken.balanceOf(addr1.address);
            const addr2Balance = await myNameToken.balanceOf(addr2.address);
            const ownerBalance = await myNameToken.balanceOf(owner.address);
            expect(addr1Balance).to.equal(ethers.utils.parseUnits("100", 18));
            expect(addr2Balance).to.equal(ethers.utils.parseUnits("50", 18));
            expect(ownerBalance).to.equal(
                ethers.utils.parseUnits("100000", 18)
                    .sub(ethers.utils.parseUnits("100", 18))
                    .sub(ethers.utils.parseUnits("50", 18))
            );
        });
    });

    describe("Approval", function () {
        it("Should approve tokens for spending", async function () {
            await myNameToken.approve(addr1.address, 100);
            const allowance = await myNameToken.allowance(owner.address, addr1.address);
            expect(allowance).to.equal(100);
        });

        it("Should transfer tokens from approved account", async function () {
            await myNameToken.approve(addr1.address, 100);
            await myNameToken.connect(addr1).transferFrom(owner.address, addr2.address, 50);
            const addr2Balance = await myNameToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
    });
});