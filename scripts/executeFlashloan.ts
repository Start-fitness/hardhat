import {ethers} from "ethers";
import flashLoanJson from "../artifacts/contracts/FlashLoan.sol/FlashLoan.json"
import {FlashLoanParams} from "../types";


export async function executeFlashLoan(params: FlashLoanParams) {
    // const Flashloan: any = new ethers.Contract(params.flashLoanContractAddress, flashLoanJson.abi, params.wallet);
    const Flashloan: any = new ethers.Contract(params.flashLoanContractAddress, flashLoanJson.abi, params.signer);
    const tx = await Flashloan.executeFlashLoan({
        flashLoanPoll: params.flashLoanPool,
        loanAmount: params.loanAmount,
        routes: [
            {
                hops: params.hops,
                part: 10000
            },
            {
                gasLimit: params.gasLimit,
                gasPrice: params.gasPrice
            }
        ],
    });
    return tx;
}