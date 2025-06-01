const hre = require("hardhat");

async function main() {
    // Get the contract to deploy
    const NguyenThanhAn = await hre.ethers.getContractFactory("NguyenThanhAn");
    
    const myToken = await NguyenThanhAn.deploy();
    await myToken.deployed();
    console.log("ThanhAn deployed to:", myToken.address);
}


// Run the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });