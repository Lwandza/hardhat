

const hre = require("hardhat");
// Returns the Ether balance of a given address.
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}
// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
      console.log(`Address ${idx} balance: `, await getBalance(address));
      idx ++;
    }
}

async function main() {
    // Get the example accounts we'll be working with.
    const [owner, tipper, tipper2, tipper3,tipper4,tipper5] = await hre.ethers.getSigners();
  
    // We get the contract to deploy.
    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy({
        value: hre.ethers.utils.parseEther('10')
    });
  
    // Deploy the contract.
    await staking.deployed();
    console.log("staking deployed to:", staking.address);
   
    // Check balances before the staking 
    const addresses = [owner.address, tipper.address,tipper2.address,tipper3.address,tipper4.address,tipper5.address, staking.address];
    console.log("== start ==");
    await printBalances(addresses);
  
    // Buy the owner a few coffees.
    const tip = {value: hre.ethers.utils.parseEther("0.01")};
    await staking.connect(tipper).stakeEther(30, tip);
    await staking.connect(tipper2).stakeEther(90, tip);
    await staking.connect(tipper3).stakeEther(180, tip);
    await staking.connect(tipper4).stakeEther(30, tip);
    await staking.connect(tipper5).stakeEther(365, tip);


    console.log("== User staked ==");
    await printBalances(addresses);

    console.log("== Lock Periods ==");
    const periods = await staking.getLockPeriods();
    console.log(periods);

    console.log("== Lock Periods Interest ==");
    const firstLock = await staking.getInterestRate(30);
    const secondLock = await staking.getInterestRate(90);
    const thirdLock = await staking.getInterestRate(180);
    const forthLock = await staking.getInterestRate(365);
    console.log(firstLock);
    console.log(secondLock);
    console.log(thirdLock);
    console.log(forthLock);

   console.log("== Positions ==");
   const firstPosition = await staking.getLockPeriodsPositions();
   console.log(firstPosition);
   await staking.connect(tipper).stakeEther(30, tip);
   const secondPosition = await staking.getLockPeriodsPositions();
   const currentPosition = await staking.getPositionById(firstPosition)
   var endDate= new Date(currentPosition.unlockDate*1000);
   console.log(secondPosition);
   console.log(currentPosition.unlockDate);
   console.log(endDate.toDateString());

   console.log("== Modify lock periods ==");
   await staking.connect(owner).modifyLockPeriods(100, 999);
   const newTier = await staking.tiers(100);
   console.log(newTier);

  await staking.connect(owner).modifyLockPeriods(100, 900);

   const newTierChanged =await staking.tiers(100);
   console.log(newTierChanged);

   console.log("== Modify unlock date ==");
   const firstStakeDetails = await staking.getPositionById(0)
   var firstStakeDate= new Date(firstStakeDetails.unlockDate*1000);
   console.log("Original Date: ", firstStakeDate);
   const newUnlockDate = firstStakeDetails.unlockDate -(86400 * 32);
   await staking.connect(owner).changeUnlockDate(0,newUnlockDate)
   console.log("Has the date been changed")
   const newStakeDetails = await staking.getPositionById(0)
   var newStakeDate= new Date(newStakeDetails.unlockDate*1000);
   console.log("New Date: ", newStakeDate);

   console.log("== Transfers principal and interest ==");
   const unstakingPosition = await staking.getPositionById(0)
   const tipperBalanceBefore = await tipper.getBalance()
   console.log("first balance: ", tipperBalanceBefore)
   transaction = await staking.connect(tipper).closePosition(0)
   receipt = await transaction.wait()
   const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
   const expectedBalance = tipperBalanceBefore.sub(gasUsed).add(unstakingPosition.weiStaked).add(unstakingPosition.weiInterest)
  
   console.log("Expected balance: ", expectedBalance)
   const tipperBalanceAfter = await tipper.getBalance()
   console.log("Balance: ", tipperBalanceAfter)

   console.log("== Transfers principal ==");
   const unstaking1Position = await staking.getPositionById(1)
   const tipper2BalanceBefore = await tipper2.getBalance()
   console.log("first balance 1: ", tipper2BalanceBefore)
   transaction1 = await staking.connect(tipper2).closePosition(1)
   receipt1 = await transaction1.wait()
   const gas1Used = receipt1.gasUsed.mul(receipt1.effectiveGasPrice)
   const lostBalance = tipper2BalanceBefore.sub(gas1Used).add(unstaking1Position.weiStaked).add(unstaking1Position.weiInterest)
   console.log("Lost balance: ", lostBalance)
   const expected1Balance = tipper2BalanceBefore.sub(gas1Used).add(unstaking1Position.weiStaked)
   console.log("Expected balance 1: ", expected1Balance)
   const tipper2BalanceAfter = await tipper2.getBalance()
   console.log("Balance 1: ", tipper2BalanceAfter)

   console.log("== getPositionIdsForAddress ==");
   const positionsUser = await staking.getPositionIdsForAddress(tipper.address)
   const getTheInfo = await staking.getPositionById(parseInt(positionsUser[1]._hex))
   console.log(positionsUser)
   console.log(getTheInfo)
 
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
