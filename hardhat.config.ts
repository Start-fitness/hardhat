import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    polygon: {
      url: "https://rpc.ankr.com/polygon",
    },
    // hardhat: {
    //   forking: {
    //     url: "https://eth-mainnet.g.alchemy.com/v2/b480ad7633384c2182710211530d4bdd",
    //     blockNumber: 19362010,
    //   },
    // },
  },

};

export default config;
