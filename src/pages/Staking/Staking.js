import  React, {  useEffect, useState } from 'react';
import { ethers } from "ethers";
// const ethers = require("ethers")
import abi from '../../contracts/contracts/Staking.sol/Staking.json'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CardActionArea } from '@mui/material';
import coffee from '../../assets/coffee.jpg'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';  
import Input from '@mui/material/Input';
import networkLogo from '../../assets/sepolia.png'

function Staking() {
    const contractAddress = "0xe05E50454a2eEc295A9bf05E94F3bE89Fb800418";
    // const contractAddress = "0x3a116fCfCE582b89f48603aA631074Ee8212afA3";
      //  const contractAddress = "0xA2630fcad6Cfa848E279d2C0E4C4cB3e0614DEb0";
    const contractABI = abi.abi;
    const [currentAccount, setCurrentAccount] = useState("");
    const [lockPeriods, setLockPeriods] = useState([]);
    const [userStakes, setUserStakes] = useState([]);
    const [userBalance, setUserBalance] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [amount, setAmount] = useState("");
    const [stakeHint, setStakeHint] = useState("Insert amount you would like to stake");
    const [stakePassedTest, setStakePassedTest] = useState(false);
    const [buttonPressable, setButtonPressable] = useState(true);
    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };
    const toWei = ether => ethers.utils.parseEther(ether)
    const toEther = wei => ethers.utils.formatEther(wei)
    const onChange =(event)=> {
      console.log(amount)
      setAmount(event.target.value)
      var arrived = event.target.value
      console.log(arrived)
      var check= isNaN(arrived) 
      console.log(check)
      if(check ==true){
        setStakeHint("Please enter a valid number")
      }
      else{
        setStakeHint("Insert amount you would like to stake")
        if(arrived >userBalance){
          setStakeHint("Amount exceeds the amount in your account")
        }
        else{
          setStakeHint("passed")
          setButtonPressable(false)
        }
      }
      // if (event.target.value.match(phoneRegex)) {
      //   this.setState({ errorText: '' })
      // } else {
      //   this.setState({ errorText: 'Invalid format: ###-###-####' })
      // }
    }

    useEffect(() => {
    
      isWalletConnected();
    
    }, []);

    const changeDate = async() =>{
   
      try {
        const  {ethereum}  = window;
        if (ethereum) {
          console.log("getting lock  periods")
          const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
          const signer = provider.getSigner();
         
  
          const staking = new ethers.Contract(
            contractAddress,
            contractABI,
             signer
          );
          // console.log("staking",staking)
          
          const firstStakeDetails = await staking.getPositionById(0)
          var firstStakeDate= new Date(firstStakeDetails.unlockDate*1000);
          console.log("Original Date: ", firstStakeDate);
          const newUnlockDate = firstStakeDetails.unlockDate -(86400 * 58);
          const changeDate = await staking.changeUnlockDate(0,newUnlockDate)
         
          console.log("stake fetched!", changeDate);
          
            var test =[]
         
        } else {
          console.log("Metamask is not connected Memo");
        }
      } catch (error) {
        console.log(error);
      }
    }

    const stakeToPool = async(item) =>{
      console.log(item)
      console.log("stake")
      try {
        const  {ethereum}  = window;
        if (ethereum) {
          console.log("getting lock  periods")
          const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
          const signer = provider.getSigner();
         
  
          const staking = new ethers.Contract(
            contractAddress,
            contractABI,
             signer
          );
          // console.log("staking",staking)
          const numDays=item
          console.log(  );
          const stakingtoPool = await staking.stakeEther(
            numDays ? numDays:numDays, 
            {value: ethers.utils.parseEther(amount)}
          );
          await stakingtoPool.wait();
          console.log("stake fetched!", stakingtoPool.hash);
          
          
         
        } else {
          console.log("Metamask is not connected Memo");
        }
      } catch (error) {
        console.log(error);
      }
    }

    const withdrawPool = async(item) =>{
      console.log(item)
      console.log("stake")
      try {
        const  {ethereum}  = window;
        if (ethereum) {
          console.log("getting lock  periods")
          const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
          const signer = provider.getSigner();
         
  
          const staking = new ethers.Contract(
            contractAddress,
            contractABI,
             signer
          );
          // console.log("staking",staking)
          // const numDays=item
          // console.log(  );
          const closeStake = await staking.closePosition(item)
          await closeStake.wait();
          getLockperiods(currentAccount);
          
          
         
        } else {
          console.log("Metamask is not connected Memo");
        }
      } catch (error) {
        console.log(error);
      }
    }

    const isWalletConnected = async () => {
      try {
          const { ethereum } = window;

          const accounts = await ethereum.request({method: 'eth_accounts'})
          console.log("accounts: ", accounts);
          console.log('start check')

          if (accounts.length > 0) {
              const account = accounts[0];
              console.log("wallet is connected! Staking" + account);
              let n = ethereum.chainId 
              console.log("chainId: ", n)
              if(n != "0xaa36a7"){
                try {
    
                  await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: "0xaa36a7"}],
                  });
                  console.log("You have switched to the right network")
                  setCurrentAccount(account);
                 
                  getLockperiods(account)
                  // getMemos();
                  
                } catch (switchError) {
                  
                  // The network has not been added to MetaMask
                  if (switchError.code === 4902) {
                   console.log("Please add the Sepolia network to MetaMask")
                  }
                  console.log("Cannot switch to the network")
                  
                }
              }
              else{
                setCurrentAccount(account);
                getLockperiods(account)
                // getMemos();
              }
              // setCurrentAccount(account)
              // getMemos();
          } else {
              console.log("make sure MetaMask is connected");
          }
      } catch (error) {
          console.log("error: ", error);
      }

      
  }
  const calcDaysRemaining = (unlockDate) => {
    const timeNow = Date.now() / 1000
    const secondsRemaining = unlockDate - timeNow
    return Math.max( (secondsRemaining / 60 / 60 / 24).toFixed(0), 0)
  }

  const getLockperiods = async (account)=>{
    try {
      const  {ethereum}  = window;
      console.log('get lock')
      if (ethereum) {
        console.log("getting lock  periods")
        const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
        const signer = provider.getSigner();
       

        const staking = new ethers.Contract(
          contractAddress,
          contractABI,
           signer
        );
        // console.log("staking",staking)
        
        console.log("fetching memos from the blockchain..");
        const stakingPeriods = await staking.getLockPeriods();
    
        console.log("fetched!");
        
          var test =[]
        for (let i = 0; i < stakingPeriods.length; i++) {
          // console.log("fetched stakingPeriods", parseInt(stakingPeriods[i]._hex))
          const interest = await staking.getInterestRate(parseInt(stakingPeriods[i]._hex));
          // console.log(parseInt(interest._hex))
          test.push({stakingLength:parseInt(stakingPeriods[i]._hex), stakingInterest:parseInt(interest._hex)})
          // lockPeriods.push({stakingLength:parseInt(stakingPeriods[i]._hex), stakingInterest:parseInt(interest._hex)})

        }
        console.log("test results", test)
        setLockPeriods(test)
        console.log("end",account)
        var myStakes =[]
        const userStakesFound = await staking.getPositionIdsForAddress(account);
        for (let s = 0; s < userStakesFound.length; s++) {
         
          const theStake = await staking.getPositionById(parseInt(userStakesFound[s]._hex));
          const theStake2 = await staking.positions(parseInt(userStakesFound[s]._hex));
          // console.log("the stahe 2",theStake2 )
          const myInterrest = toEther(theStake.weiInterest)
          const myStake = toEther(theStake.weiStaked)
          const poolInterest = parseFloat(theStake.percentInterest)
          const daysRemaining= calcDaysRemaining( Number(theStake.unlockDate) )
          const withdrawalAvailable= theStake.open
          const positionId = Number(theStake.positionId)
          // console.log(myInterrest)
          console.log(s,Number(theStake.positionId))
          // console.log(poolInterest)
          // console.log(s,toEther(theStake.weiInterest))
          // console.log(s,toEther(theStake2.weiInterest))
          myStakes.push({
            positionId:positionId,
            stakedAmount:myStake,
            interestEarning:myInterrest,
            daysRemaining:daysRemaining,
            poolInterest:poolInterest, 
            withdrawalAvailable:withdrawalAvailable
          })
          // lockPeriods.push({stakingLength:parseInt(stakingPeriods[i]._hex), stakingInterest:parseInt(interest._hex)})

        }
        setUserStakes(myStakes)
        const balance= await provider.getBalance(account)
        console.log("balance", parseFloat(balance/(Math.pow(10,18))))
        setUserBalance(parseFloat(balance/(Math.pow(10,18))))
      
        console.log("myStakes", myStakes)
      } else {
        console.log("Metamask is not connected Memo");
      }

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Grid >
  
        <Card sx={{margin: "0 auto", padding: "3.1em", border: "none", boxShadow: "none"}}>
          <CardMedia 
            component="img"
            height="140"
            sx={{ objectFit: "contain" }}
            image={networkLogo}
            alt="Live from space album cover"
          />
        
        </Card>
        <Typography sx={{ fontSize: 30, marginTop:-5, marginBottom:20 }} color="#A9612B" gutterBottom>
            Sepolia Network Staking pools
        </Typography>
        {/* <Button variant="outlined"  onClick={()=>{changeDate()}} >Change Days</Button> */}

    {currentAccount ?(
      <Grid>
        {lockPeriods.map((item, idx)=>{
          return(
            <Accordion expanded={expanded === 'panel'+idx} onChange={handleChange('panel'+idx)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
               Timeframe:  {item.stakingLength} Days
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Interest {item.stakingInterest/100}%</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              Stake In Pool
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    
                    id="standard-adornment-amount"
                    label="Amount"
                    defaultValue=""
                    value={amount}
                    helperText={stakeHint}
                
                    // onChange={(event) => {
                    //   setAmount(event.target.value);
                    // }}
                    onChange={(event)=>{onChange(event)}}
                    fullWidth 
                  />
                </Grid>
                <Grid item xs={4}>
                <Button variant="outlined" disabled={buttonPressable} onClick={()=>{stakeToPool(item.stakingLength)}}>Stake</Button>
                </Grid>
                <Grid style={{width:'100%',paddingLeft:10 }}>
                  {userStakes&&(
                    <TableContainer component={Paper} >
                    <Table stickyHeader aria-label="sticky table" >
                      <TableHead>
                        <TableRow>
                          <TableCell>Staked Amount</TableCell>
                          <TableCell align="right">Interest You Will Earn</TableCell>
                          <TableCell align="right">Days Remaining</TableCell>
                   
                          <TableCell align="right"></TableCell>
                         
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userStakes.filter((stakes)=>{
                          if(parseInt(stakes.poolInterest) ==item.stakingInterest){
                            console.log("passed")
                            console.log(parseInt(stakes.poolInterest))
                            console.log(item.stakingInterest)
                            console.log(stakes.InterestEarning)
                           
                        
                            return stakes
                          }
                          else{
                            console.log("failed")
                            return null
                          }
                        }).map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {row.stakedAmount}
                            </TableCell>
                            <TableCell align="right">{row.interestEarning}</TableCell>
                          
                            <TableCell align="right">{row.daysRemaining}</TableCell>
                            <TableCell align="right">{row.withdrawalAvailable ? (<Button variant="outlined" onClick={()=>{withdrawPool(row.positionId)}} >Withdraw Stake</Button>):(<Button variant="outlined" disabled >Closed</Button>)} </TableCell>
                            {/* <TableCell align="right"> <Button variant="outlined" disabled >Withdraw</Button></TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        
          )
          
        })}
      </Grid>
    ) : (
      <Typography sx={{ fontSize: 30, marginBottom:20 }} color="#A9612B" gutterBottom>
          Please connect to see staking pools
      </Typography>
    )}
    </Grid>
  )
}

export default Staking