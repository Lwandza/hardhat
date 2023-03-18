// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


  // Buy me coffee Delpoyment
  // const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  // const buyMeACoffee = await BuyMeACoffee.deploy();

  // await buyMeACoffee.deployed();

  // console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

  // Staking Deployment
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy({
    value: hre.ethers.utils.parseEther('1.3')
  });

  await staking.deployed();

  console.log("Staking deployed to:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
