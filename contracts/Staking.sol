//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.9;


contract Staking {
    address public owner;

    struct Position{
        uint positionId;
        address walletAddress;
        uint createdDate;
        uint unlockDate;
        uint percentInterest;
        uint weiStaked;
        uint256 weiInterest;
        bool open;

    }

    Position position;

    uint public currentPositionId;
    mapping(uint => Position) public positions;
    mapping(address => uint[]) public positionIdsByAddress;
    mapping(uint => uint) public tiers;
    uint[] public lockPeriods;

    constructor() payable{
        owner = msg.sender;
        currentPositionId = 0;

        tiers[30]=7;
        tiers[90]=10;
        tiers[180]=12;
        tiers[365]=15;

        lockPeriods.push(30);
        lockPeriods.push(90);
        lockPeriods.push(180);
        lockPeriods.push(365);

    }

    function stakeEther(uint numDays) external payable{
        require(tiers[numDays]>0,"Staking pool not found");

        positions[currentPositionId]= Position(
            currentPositionId,
            msg.sender,
            block.timestamp,
            block.timestamp + (numDays * 1 days),
            tiers[numDays],
            msg.value,
            calculateInterest(tiers[numDays], numDays, msg.value),
            true
        );

        positionIdsByAddress[msg.sender].push(currentPositionId);
        currentPositionId +=1;

    }

    function calculateInterest(uint basisPoints, uint numDays, uint weiAmount) private pure returns (uint){
        // return basisPoints* weiAmount /10000/100*numDays ;

        return weiAmount/100*basisPoints/365*numDays;
    }
   
    function modifyLockPeriods(uint numDays, uint basisPoints) external{
        require(owner == msg.sender, "Only owner may modify staking periods");
        
        tiers[numDays]= basisPoints;
        lockPeriods.push(numDays);
    }

    function getLockPeriods() external view returns(uint[] memory){
        return lockPeriods;
    }
    function getLockPeriodsPositions() external view returns(uint){
        return currentPositionId;
    }

    function getInterestRate(uint numDays) external view returns(uint){
        return tiers[numDays];
    }
    
    function getPositionById(uint positionId) external view returns(Position memory){
        return positions[positionId];
    }

    function getPositionIdsForAddress(address walletAddress) external view returns(uint[] memory){
        return positionIdsByAddress[walletAddress];
    }
    
    function changeUnlockDate(uint possitionId, uint newUnlockDate) external{
         require(owner == msg.sender, "Only owner may modify staking periods");

         positions[possitionId].unlockDate = newUnlockDate;
    }
    function closePosition(uint positionId) external{
        require(positions[positionId].walletAddress == msg.sender, "Only position creator may modify position");
        require(positions[positionId].open == true, "Position is closed");

        positions[positionId].open = false;

        if(block.timestamp > positions[positionId].unlockDate){
            uint amount = positions[positionId].weiStaked + positions[positionId].weiInterest;
            payable(msg.sender).call{value: amount}("");
        }
        else{
             payable(msg.sender).call{value: positions[positionId].weiStaked}("");
        }
    }





 
}