import {ethers} from "ethers";

export type Hop = {
    protocol: number;
    data: string;
    path: string[];
};

export type Protocol = {
    UNISWAP_V3: number;
    UNISWAP_V2: number;
    SUSHISWAP: number;
    QUICKSWAP: number;
    JETSWAP: number;
    POLYCAT: number;
    APESWAP: number;
    WAULTSWAP: number;
    DODO: number;
};

export type DeployDODOFlashloanParams = {
    wallet: ethers.Wallet | ethers.JsonRpcSigner;
};

export type IToken = {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
    logoURI: string;
};

export type erc20Token = { [erc20: string]: IToken };
export type RouterMap = { [protocol: string]: string };

export type FlashLoanParams = {
    // wallet?: ethers.Wallet;
    flashLoanContractAddress: string;
    flashLoanPool: string;
    loanAmount: number | ethers.BigNumberish;
    loanAmountDecimals: number;
    hops: Hop[];
    gasLimit: number;
    gasPrice: number | bigint;
    signer: ethers.Signer;
};
