require('@nomiclabs/hardhat-waffle');
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/bfb42299930241af945820758ab75a46",
      accounts: [
        "0x4e16494fccd13a7c0e1d5b083e7966586d9a7089ba754b4b161bc33ec07d8ae9",
        "0xae9049081b1d3f67fe8eab67f48ec1d0828d5a9794ba2715e79d9bd4a2e3f277"
      ]
    }
  },
  etherscan: {
    apiKey: "R7MYKSI18UA7S418F6FDJX25GG5GMJDXGW"
  }
}