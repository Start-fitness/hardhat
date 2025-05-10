import {ethers} from "ethers";
import {deployDodoFlashloan} from "../scripts/deployDodoFlashloan"
import {FlashLoanParams} from "../types";
import {dodoV2Pool, Protocols} from "../constants";
import {findRouterByProtocol} from "../utils/findRouterByProtocol";
import {ERC20Token} from "../constants/token";
import {executeFlashLoan} from "../scripts/executeFlashloan";

require("dotenv").config();

describe("DODO flashloan", () => {
    it('Execute flashloan', async () => {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey!, provider);
const Flashloan = await deployDodoFlashloan({
wallet
});

const params: FlashLoanParams = {
    flashLoanContractAddress: Flashloan.target.toString(),
    flashLoanPool: dodoV2Pool.WETH_ULT,
    loanAmount: ethers.parseEther("1"),
     loanAmountDecimals: 18,
    hops: [
        {
protocol: Protocols.UNISWAP_V2,
            data: ethers.AbiCoder.defaultAbiCoder().encode(
                ["address"],
                [findRouterByProtocol(Protocols.UNISWAP_V2)] ),
                path: [ERC20Token.WETH?.address, ERC20Token.USDC?.address]
        },
        {
            protocol: Protocols.SUSHISWAP,
            data: ethers.AbiCoder.defaultAbiCoder().encode(
                ["address"],
                [findRouterByProtocol(Protocols.SUSHISWAP)] ),
            path: [ERC20Token.USDC?.address, ERC20Token.WETH?.address]
        }
    ],
    gasLimit: 3_000_000,
    gasPrice: ethers.parseUnits("300", "gwei"),
    signer: wallet
};
        console.log("PARAMS", params);
        console.log("POOLS", ethers.isAddress(params.flashLoanPool));
const tx = await executeFlashLoan(params);
        console.log("tx hash", tx.hash);

    });
})