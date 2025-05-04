// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./base/DodoBase.sol";
import "./base/FlashloanValidation.sol";
import "./base/Withdraw.sol";
import "./interfaces/IFlashloan.sol";
import "./libraries/Part.sol";
import "./libraries/RouteUtils.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SignedMath.sol";
import "./uniswap/v3/ISwapRouter.sol";
import "./uniswap/IUniswapV2Router.sol";
import "hardhat/console.sol";
import "./interfaces/IDODOProxy.sol";

contract FlashLoan is IFlashloan, DodoBase, FlashloanValidation, Withdraw {
    using SignedMath for uint256;
    event SentProfit(address recipient, uint256 profit);
    event SwapFinished(address token, uint256 amount);

    /**
    * @dev initiates a flash loan transaction with Dodo protocol.
    * @param params Struct containing parameters for the flash loan.
    */
    function executeFlashLoan(
        FlashParams memory params
    ) external checkParams(params) {
        bytes memory data = abi.encode(FlashParams({
            flashLoanPool: params.flashLoanPool,
            loanAmount: params.loanAmount,
            routes: params.routes
        }));
        address loanToken = RouteUtils.getInitialToken(params.routes[0]);
        console.log("CONTRACT BALANCE BEFORE BORROW", IERC20(loanToken).balanceOf(address(this)));
        address btoken = IDODO(params.flashLoanPool)._BASE_TOKEN_();
        console.log(btoken, "BASE TOKEN");
        uint256 baseAmount = IDODO(params.flashLoanPool)._BASE_TOKEN_() == loanToken ? params.loanAmount : 0;
        uint256 quoteAmount = IDODO(params.flashLoanPool)._BASE_TOKEN_() == loanToken ? 0 : params.loanAmount;

        IDODO(params.flashLoanPool).flashLoan(
            baseAmount,
            quoteAmount,
            address(this),
            data
        );
    }

    function _flashLoanCallBack(
        address,
        uint256,
        uint256,
        bytes calldata data
    ) internal override {
        FlashParams memory decoded = abi.decode(data, (FlashParams));
        address loanToken = RouteUtils.getInitialToken(decoded.routes[0]);
        require(IERC20(loanToken).balanceOf(address(this)) >= decoded.loanAmount, "Failed to borrow tokens");
        console.log(IERC20(loanToken).balanceOf(address(this)), "CONTRACT BALANCE AFTER BORROWING");
        routeLoop(decoded.routes, decoded.loanAmount);

        console.log(IERC20(loanToken).balanceOf(address(this)), "LOAN TOKEN CONTRACT BALANCE AFTER BORROW AND SWAP");
        emit SwapFinished(loanToken, IERC20(loanToken).balanceOf(address(this)));

        require(IERC20(loanToken).balanceOf(address(this)) >= decoded.loanAmount, "Not enough amount to return the loan");
        IERC20(loanToken).transfer(decoded.flashLoanPool, decoded.loanAmount);
        console.log(IERC20(loanToken).balanceOf(address(this)), "LOAN TOKEN CONTRACT BALANCE AFTER REPAY");

        uint256 remained = IERC20(loanToken).balanceOf(address(this));
        IERC20(loanToken).transfer(owner(), remained);

        emit SentProfit(owner(), remained);
    }

    function routeLoop(
        Route[] memory routes,
        uint256 totalAmount
    ) internal checkTotalRoutePart(routes) {
        for (uint256 i = 0; i < routes.length; i++) {
            uint256 amountIn = Part.partToAmountIn(routes[i].part, totalAmount);
            console.log(totalAmount, "LOAN TOKEN AMOUNT TO SWAP");
            hopLoop(routes[i], amountIn);
        }
    }

    function hopLoop(Route memory route, uint256 totalAmount) internal {
        uint256 amountIn = totalAmount;
        for (uint256 i = 0; i < route.hops.length; i++) {
            amountIn = pickProtocol(route.hops[i], amountIn);
        }
    }

    function pickProtocol(Hop memory hop, uint256 amountIn) internal returns (uint256 amountOut) {
        if (hop.protocol == 0) {
            amountOut = uniswapV3(hop.data, amountIn, hop.path);
            console.log(amountOut, "AMOUNT RECEIVED FROM PROTOCOL ");
        } else if (hop.protocol < 8) {
            amountOut = uniswapV2(hop.data, amountIn, hop.path);
            console.log(amountOut, "AMOUNT RECEIVED FROM PROTOCOL ");
        } else {
            amountOut = dodoV2Swap(hop.data, amountIn, hop.path);
            console.log(amountOut, "AMOUNT RECEIVED FROM PROTOCOL ");
        }

    }

    function uniswapV3(
        bytes memory data,
        uint256 amountIn,
        address[] memory path
    ) internal returns (uint256 amountOut) {
        (address router, uint24 fee) = abi.decode(data, (address, uint24));
        ISwapRouter swapRouter = ISwapRouter(router);
        approveToken(path[0], address(swapRouter), amountIn);
        amountOut = swapRouter.exactInputSingle(ISwapRouter.ExactInputSingleParams({
            tokenIn: path[0],
            tokenOut: path[1],
            fee: fee,
            recipient: address(this),
            deadline: block.timestamp + 60,
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        }));
    }

    function uniswapV2(
        bytes memory data,
        uint256 amountIn,
        address[] memory path
    ) internal returns (uint256 amountOut) {
        address router = abi.decode(data, (address));
        approveToken(path[0], router, amountIn);
        amountOut = IUniswapV2Router(router).swapExactTokensForTokens(
            amountIn,
            1,
            path,
            address(this),
            block.timestamp + 60)[1];
    }

    function dodoV2Swap(
        bytes memory data,
        uint256 amountIn,
        address[] memory path
    ) internal returns (uint256 amountOut) {
        (address dodoV2Pool, address dodoApprove, address dodoProxy) = abi.decode(data, (address, address, address));
        address[] memory dodoPairs = new address[](1);
        dodoPairs[0] = dodoV2Pool;
        uint256 directions = IDODO(dodoV2Pool)._BASE_TOKEN_() == path[0] ? 0 : 1;
        approveToken(path[0], dodoApprove, amountIn);
        amountOut = IDODOProxy(dodoProxy).dodoSwapV2TokenToToken(
            path[0],
            path[1],
            amountIn,
            1,
            dodoPairs,
            directions,
            false,
            block.timestamp + 60
        );
    }

    function approveToken(
        address token,
        address to,
        uint256 amountIn
    ) internal {
        require(IERC20(token).approve(to, amountIn), "Approve failed");
    }

}
