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
}

contract BrettTokenPurchase is Ownable {
    address public uniswapRouter;
    address public brettToken;
    uint256 public feePercentage = 10;
    uint256 public poolBalance;
    uint256 public codeCounter = 1;

    struct CodeInfo {
        uint256 code;
        address[] addressList;
    }

    // Map each code to CodeInfo (code and its associated addresses)
    mapping(uint256 => CodeInfo) public codes;
    mapping(address => uint256) public userCode;

    event CodeGenerated(address indexed user, uint256 code);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 fee, uint256 code);

    constructor(address _uniswapRouter, address _brettToken) {
        uniswapRouter = _uniswapRouter;
        brettToken = _brettToken;
    }

    // Generate a unique referral code for the given user address
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

    // Buy Brett tokens using a referral code
    function buyBrettWithFee(uint256 code) external payable {
        require(codes[code].addressList.length > 0, "Invalid code");

        uint256 amountIn = msg.value;
        uint256 feeAmount = (amountIn * feePercentage) / 100;
        uint256 purchaseAmount = amountIn - feeAmount;

        // Split the fee: 5% to pool, 5% to the referral addresses linked to the code
        uint256 poolFee = feeAmount / 2;
        uint256 referralFee = feeAmount - poolFee;
        poolBalance += poolFee;

        // Add the buyer to the referral list if not already in the list
        address[] storage referralAddresses = codes[code].addressList;
        bool isAlreadyReferred = false;
        for (uint i = 0; i < referralAddresses.length; i++) {
            if (referralAddresses[i] == msg.sender) {
                isAlreadyReferred = true;
                break;
            }
        }
        if (!isAlreadyReferred) {
            referralAddresses.push(msg.sender);
        }

        // Distribute referral fees among all addresses linked to the code
        uint256 perUserReward = referralFee / referralAddresses.length;
        for (uint i = 0; i < referralAddresses.length; i++) {
            payable(referralAddresses[i]).transfer(perUserReward);
        }

        // Uniswap swap path: ETH -> Brett
        address;
        path[0] = uniswapRouter.WETH();
        path[1] = brettToken;

        // Swap ETH for Brett tokens
        IUniswapRouter(uniswapRouter).swapExactETHForTokens{value: purchaseAmount}(
            1, // Minimum amount out
            path,
            msg.sender,
            block.timestamp + 300 // Deadline: 5 minutes
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