import {erc20ABI, factoryABI, pairABI, routerABI} from "../utils/ABIList";
import { addressFactory, addressRouter, addressFrom, addressTo } from "../utils/addressList"
import {ethers} from "hardhat";
import {assert, expect} from "chai";
import { Overrides } from "ethers";


describe("Read and write to the blockchain", () => {
    let provider, contractFactory, contractAddress, contractRouter, contractToken, decimals, amountIn: any | Overrides, amountOut;

provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
contractFactory = new ethers.Contract(addressFactory, factoryABI, provider);
contractRouter = new ethers.Contract(addressRouter, routerABI, provider);
contractToken = new ethers.Contract(addressFrom, erc20ABI, provider );
    const getAmountOut = async () => {
        console.log("contractToken", contractToken);
        console.log("ERC20 ABI:", JSON.stringify(erc20ABI, null, 2));

        decimals = await contractToken.decimals();
        console.log("decimals", decimals);

        const amountInHuman = "1";
        amountIn = ethers.parseUnits(amountInHuman,decimals).toString();
        console.log("amountIn", amountIn);
        const amountsOut = await contractRouter.getAmountOut(amountIn, [addressFrom, addressTo]);
        return amountsOut[1].toString();
    };


    it("Connect to factory,  router and token", async () => {
assert(provider instanceof ethers.JsonRpcProvider);
expect(contractFactory.target).to.equal("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73");
expect(contractRouter.target).to.equal("0x10ED43C718714eb63d5aA57B78B54704E256024E");
expect(contractToken.target).to.equal("0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56");
    });

    it("get Amounts Out", async () => {
        const amount = await getAmountOut();
        assert(amount);
        console.log(amount);
    })
});