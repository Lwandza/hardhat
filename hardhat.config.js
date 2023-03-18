// hardhat.config.js

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config()

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const { SEPOLIA_URL, PRIVATE_KEY } = process.env;
// const SEPOLIA_URL = process.env.ETH_SEPOLIA;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "sepolia",
  networks: {

    sepolia: {

      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],

    }
  }, 
  paths:{
    artifacts:"./frontend/src/contracts"
  }
};