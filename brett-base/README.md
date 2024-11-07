## Brett

Contract concept:

````
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "../github/Uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "../github/Uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract TransactionManager is Ownable {

    ISwapRouter public swapRouter;
    // 0x532f27101965dd16442e59d40670faf5ebb142e4 - Brett on base
    address public brettToken;                                          // Brett token address on Base
    address public weth = 0x4200000000000000000000000000000000000006;   // WETH token address for Uniswap
    uint24 public constant poolFee = 3000;                              // Uniswap V3 pool fee
    uint256 public feePercentage = 10;                                  // Percentage fee per transaction
    uint256 public poolBalance;                                         // Contract pool balance
    uint256 public codeCounter = 1;                                     // Code generation counter

    struct CodeInfo {
        uint256 code;
        address[] addressList;
    }

    mapping(uint256 => CodeInfo) public codes;
    mapping(address => uint256) public userCode;

    event CodeGenerated(address indexed user, uint256 code);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 fee, uint256 code);

    constructor(
        address initialOwner_,
        ISwapRouter _swapRouter,
        address _brettToken
    ) Ownable(initialOwner_) {
        swapRouter = _swapRouter;
        brettToken = _brettToken;
    }

    function getReferralCode(address userAddr) public view returns (uint256) {
        return userCode[userAddr];
    }

    function generateCode(address userAddr) external returns (uint256) {
        require(userCode[userAddr] == 0, "User already has a code");

        uint256 code = codeCounter;
        CodeInfo storage newCodeInfo = codes[code];
        newCodeInfo.code = code;
        newCodeInfo.addressList.push(userAddr);

        userCode[userAddr] = code;
        codeCounter++;

        emit CodeGenerated(userAddr, code);
        return code;
    }

    function buyBrettWithFee(uint256 code) external payable {
        require(codes[code].addressList.length > 0, "Invalid code");

        uint256 amountIn = msg.value;
        uint256 feeAmount = (amountIn * feePercentage) / 100;
        uint256 purchaseAmount = amountIn - feeAmount;

        uint256 poolFeeAmount = feeAmount / 2;
        uint256 referralFeeAmount = feeAmount - poolFeeAmount;
        poolBalance += poolFeeAmount;

        address[] storage referralAddresses = codes[code].addressList;
        uint256 numRecipients = referralAddresses.length;
        uint256 perUserReward = (numRecipients > 0) ? referralFeeAmount / numRecipients : 0;

        for (uint i = 0; i < numRecipients; i++) {
            payable(referralAddresses[i]).transfer(perUserReward);
        }

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: weth,
            tokenOut: brettToken,
            fee: poolFee,
            recipient: msg.sender,
            deadline: block.timestamp + 300,
            amountIn: purchaseAmount,
            amountOutMinimum: 1,
            sqrtPriceLimitX96: 0
        });

        uint256 amountOut = swapRouter.exactInputSingle{value: purchaseAmount}(params);

        emit TokensPurchased(msg.sender, amountOut, feeAmount, code);
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