import {FlashLoan, FlashLoan__factory} from "../typechain-types";
import {deployContract} from "../utils/deployContract";

export async function deployDodoFlashloan(params: any) {
const flashLoan: FlashLoan = await deployContract(
    FlashLoan__factory,
    [],
    params.wallet
);
const deployed = await flashLoan.waitForDeployment();
    console.log("Contract deployed to", deployed.target);
    return deployed;
    // return flashLoan;
}