const hre = require("hardhat");

async function main() {
    const [owner, seller] = await hre.ethers.getSigners();
    const contract = await hre.ethers.getContractAt(
        "NguyenThanhAn",
        "0xCFc38f7de15a0536D4F93CC9E7E9c97D3B39f2B7",
        seller
    );

    const decimals = await contract.decimals();
    const actualAmount = 2; // Số lượng token muốn bán
    const amount = hre.ethers.BigNumber.from(actualAmount).mul(hre.ethers.BigNumber.from(10).pow(decimals));

    const sellerBalance = await contract.balanceOf(seller.address);
    const contractEthBalance = await hre.ethers.provider.getBalance(contract.address);
    const price = await contract.tokenPrice();
    const totalValue = price.mul(amount).div(hre.ethers.BigNumber.from(10).pow(decimals));

    console.log("Seller token balance:", hre.ethers.utils.formatUnits(sellerBalance, decimals));
    console.log("Contract ETH balance:", hre.ethers.utils.formatEther(contractEthBalance));
    console.log(`Giá mỗi token: ${hre.ethers.utils.formatEther(price)} ETH`);
    console.log(`Tổng ETH sẽ nhận: ${hre.ethers.utils.formatEther(totalValue)} ETH`);

    // Approve contract được phép chuyển token
    const approveTx = await contract.approve(contract.address, amount);
    await approveTx.wait();

    // Bán token
    const sellTx = await contract.sellTokens(amount);
    await sellTx.wait();

    console.log(`Đã bán ${hre.ethers.utils.formatUnits(amount, decimals)} ThanhAn token từ địa chỉ: ${seller.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});