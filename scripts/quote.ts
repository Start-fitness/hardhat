import {ethers, Network} from "ethers";
import quoter1Abi from "../abis/quoterAbi.json"
import quoter2Abi from "../abis/quoter2Abi.json"
import {QUOTER_ADDRESS, QUOTER_ADDRESS2} from "../constants";


// const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth/0c786e53e0d75961fd47a59431e28e618fa1338b0629a4f75014621ad5fc734c");
const provider = new ethers.JsonRpcProvider("https://ethereum.publicnode.com");
const tokenIn = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //WETH
const tokenOut = "0xdac17f958d2ee523a2206206994597c13d831ec7"; //USDT
const fee = 3000;
const amountIn = ethers.parseEther("1");
const sqrtPriceLimitX96 = ethers.toBigInt("0");
const quoter = new ethers.Contract(
    QUOTER_ADDRESS,
    quoter1Abi,
    provider
);
const quoter2 = new ethers.Contract(
    QUOTER_ADDRESS2,
    quoter2Abi,
    provider
);

const main = async () => {
    const quote1 = await quoter.quoteExactInputSingle.staticCall(
      tokenIn,
      tokenOut,
      fee,
      amountIn,
        sqrtPriceLimitX96
    );
    console.log("Amount out from quote 1", ethers.formatUnits(quote1.toString(), 6));

    const params = {
        tokenIn,
        tokenOut,
        fee,
        amountIn,
        sqrtPriceLimitX96
    };

    const quote2 = await quoter2.quoteExactInputSingle.staticCall(params);
    console.log("Amount out from quote 2", ethers.formatUnits(quote2.amountOut.toString(), 6));
    console.log("sqritPriceLimitX96After", quote2.sqrtPriceX96After.toString());
    console.log("gasEstimate", quote2.gasEstimate.toString());

}
main();