## Brett

Contract concept:

````

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapRouter {
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function WETH() external pure returns (address);
}

contract MemeTokenPurchaseOnBase is Ownable {
    address public uniswapRouter;
    address public memeToken;
    uint256 public feePercentage = 10;
    uint256 public poolBalance;
    uint256 public codeCounter = 1;

    struct CodeInfo {
        uint256 code;
        address[] addressList;
    }

    mapping(uint256 => CodeInfo) public codes;
    mapping(address => uint256) public userCode;

    event CodeGenerated(address indexed user, uint256 code);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 fee, uint256 code);

    constructor(address _uniswapRouter, address _memeToken) {
        uniswapRouter = _uniswapRouter;
        memeToken = _memeToken;
    }

    function generateCode(address userAddr) external returns (uint256) {
        require(userCode[userAddr] == 0, "User already has a code");

        uint256 code = codeCounter;
        codes[code].code = code;
        codes[code].addressList.push(userAddr);

        userCode[userAddr] = code;
        codeCounter++;

        emit CodeGenerated(userAddr, code);
        return code;
    }

    function buyMemeTokenWithFee(uint256 code, uint256 amountOutMin) external payable {
        require(codes[code].addressList.length > 0, "Invalid referral code");

        uint256 amountIn = msg.value;
        uint256 feeAmount = (amountIn * feePercentage) / 100;
        uint256 purchaseAmount = amountIn - feeAmount;

        uint256 poolFee = feeAmount / 2;
        uint256 referralFee = feeAmount - poolFee;
        poolBalance += poolFee;

        address[] storage referralAddresses = codes[code].addressList;
        uint256 numRecipients = referralAddresses.length;
        uint256 perUserReward = (numRecipients > 0) ? referralFee / numRecipients : 0;

        for (uint i = 0; i < numRecipients; i++) {
            payable(referralAddresses[i]).transfer(perUserReward);
        }

        address;
        path[0] = IUniswapRouter(uniswapRouter).WETH();
        path[1] = memeToken;

        IUniswapRouter(uniswapRouter).swapExactETHForTokens{value: purchaseAmount}(
            amountOutMin,
            path,
            msg.sender,
            block.timestamp + 300 // 5-minute deadline
        );

        emit TokensPurchased(msg.sender, purchaseAmount, feeAmount, code);
    }

    function withdrawPool() external onlyOwner {
        require(poolBalance > 0, "No funds in pool");
        uint256 amount = poolBalance;
        poolBalance = 0;
        payable(owner()).transfer(amount);
    }

    receive() external payable {}
}



````