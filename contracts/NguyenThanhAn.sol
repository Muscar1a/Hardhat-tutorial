// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NguyenThanhAn is ERC20, Ownable {
    uint256 public tokenPrice = 0.0005 ether;
    uint256 public lastPriceUpdate;
    uint256 public constant BASE = 2 * 10 ** 9;

    constructor() ERC20("ThanhAn", "ANT") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }

    function updateTokenPrice() public {
        uint256 timePassed = (block.timestamp - lastPriceUpdate) / 1 days;
        if (timePassed > 0) {
            uint256 ethBalance = address(this).balance;
            uint256 interestRate = ethBalance / BASE;
            tokenPrice += interestRate * timePassed;
            lastPriceUpdate += timePassed * 1 days;
        }
    }

    function buyTokens(uint256 amount) public payable {
        updateTokenPrice();
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(owner()) >= amount, "Not enough tokens available");

        uint256 totalCost = (amount * tokenPrice) / (10 ** decimals());
        require(msg.value >= totalCost, "Not enough Ether sent");

        _transfer(owner(), msg.sender, amount);
        uint256 refund = msg.value - totalCost;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
    }

    function sellTokens(uint256 amount) public {
        updateTokenPrice();
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Not enough tokens to sell");

        uint256 totalValue = (amount * tokenPrice) / (10 ** decimals());
        require(
            address(this).balance >= totalValue,
            "Not enough ETH in contract"
        );

        _transfer(msg.sender, owner(), amount);
        payable(msg.sender).transfer(totalValue);
    }

    receive() external payable {}
}
