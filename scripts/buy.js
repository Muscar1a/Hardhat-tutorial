const hre = require("hardhat");

async function main() {
    const [owner, buyer] = await hre.ethers.getSigners();
    const contract = await hre.ethers.getContractAt(
        "NguyenThanhAn",
        "0xCFc38f7de15a0536D4F93CC9E7E9c97D3B39f2B7",
        buyer
    );

    const decimals = await contract.decimals();
    const actualAmount = 3;
    const amount = hre.ethers.BigNumber.from("3").mul(hre.ethers.BigNumber.from(10).pow(decimals)); // 1 token
    const price = await contract.tokenPrice();
    const total = price.mul(amount).div(hre.ethers.BigNumber.from(10).pow(decimals));

    const ownerAddress = await contract.owner();
    const ownerBalance = await contract.balanceOf(ownerAddress);
    console.log("Owner balance:", hre.ethers.utils.formatUnits(ownerBalance, decimals));
    console.log(`Giá mỗi token: ${hre.ethers.utils.formatEther(price)} ETH`);
    console.log(`Tổng ETH cần gửi: ${hre.ethers.utils.formatEther(total)} ETH`);

    // Thử gửi dư 10%
    const buffer = total.div(10);
    const tx = await contract.buyTokens(amount, { value: total.add(buffer) });
    await tx.wait();

    console.log(`Đã mua ${hre.ethers.utils.formatUnits(amount, decimals)} ThanhAn token cho địa chỉ: ${buyer.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});