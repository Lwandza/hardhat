import  React, {  useEffect, useState } from 'react';
import { ethers } from "ethers";
// const ethers = require("ethers")
import abi from '../../contracts/contracts//BuyMeCoffee.sol/BuyMeACoffee.json'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import coffee from '../../assets/coffee.jpg'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';  
import Input from '@mui/material/Input';
function BuyCoffee() {
     // Contract Address & ABI
    const contractAddress = "0x7ffe51Db09B715c010E16bE2bfe47A45d34d44dc";
    const contractABI = abi.abi;

    // Component state
    const [currentAccount, setCurrentAccount] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [memos, setMemos] = useState([]);

    const onNameChange = (event) => {
        setName(event.target.value);
    }

    const onMessageChange = (event) => {
        setMessage(event.target.value);
    }
    const isWalletConnected = async () => {
        try {
            const { ethereum } = window;

            const accounts = await ethereum.request({method: 'eth_accounts'})
            //console.log("accounts: ", accounts);
            //console.log('start check')

            if (accounts.length > 0) {
                const account = accounts[0];
                //console.log("wallet is connected! " + account);
                let n = ethereum.chainId 
                //console.log("chainId: ", n)
                if(n != "0xaa36a7"){
                  try {
      
                    await ethereum.request({
                      method: 'wallet_switchEthereumChain',
                      params: [{ chainId: "0xaa36a7"}],
                    });
                    console.log("You have switched to the right network")
                    setCurrentAccount(account);
                    getMemos();
                    
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
                  getMemos();
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
    const connectWallet = async () => {
        try {
          const {ethereum} = window;
    
          if (!ethereum) {
            console.log("please install MetaMask");
          }
          else{
            const accounts = await ethereum.request({
              method: 'eth_requestAccounts'
            });
            let n = ethereum.chainId 
            //console.log("chainId: ", n)
            
            if(n != "0xaa36a7"){
              try {
  
                await ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: "0xaa36a7"}],
                });
                console.log("You have switched to the right network")
                setCurrentAccount(accounts[0]);
                getMemos();
                
              } catch (switchError) {
                
                // The network has not been added to MetaMask
                if (switchError.code === 4902) {
                 console.log("Please add the Sepolia network to MetaMask")
                }
                console.log("Cannot switch to the network")
                
              }
            }
            else{
              setCurrentAccount(accounts[0]);
              getMemos();
            }
    
            
          }
    
        
        } catch (error) {
          console.log(error);
        }
      }
      const buyCoffeeNow = async () => {
        try {
          const {ethereum} = window;
          let n = ethereum.chainId 
    
          if (ethereum) {
            if(n != "0xaa36a7"){
              try {
  
                await ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: "0xaa36a7"}],
                });
                console.log("You have switched to the right network")
                const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
                const signer = provider.getSigner();
                const buyMeACoffee = new ethers.Contract(
                  contractAddress,
                  contractABI,
                  signer
                );
        
                //console.log("buying coffee..")
                const coffeeTxn = await buyMeACoffee.buyCoffee(
                  name ? name : "anon",
                  message ? message : "Enjoy your coffee!",
                  {value: ethers.utils.parseEther("0.001")}
                );
        
                await coffeeTxn.wait();
        
                console.log("coffee purchased! ", coffeeTxn.hash);
        
                //console.log("coffee purchased!");
        
                // Clear the form fields.
                setName("");
                setMessage("");
                getMemos();
                
                
                
              } catch (switchError) {
                
                // The network has not been added to MetaMask
                if (switchError.code === 4902) {
                 console.log("Please add the Sepolia network to MetaMask")
                }
                console.log("Cannot switch to the network")
                
              }
            }
            else{
              const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
              const signer = provider.getSigner();
              const buyMeACoffee = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
              );
      
              //console.log("buying coffee..")
              const coffeeTxn = await buyMeACoffee.buyCoffee(
                name ? name : "anon",
                message ? message : "Enjoy your coffee!",
                {value: ethers.utils.parseEther("0.001")}
              );
      
              await coffeeTxn.wait();
      
              console.log("coffee purchased! ", coffeeTxn.hash);
      
              //console.log("coffee purchased!");
      
              // Clear the form fields.
              setName("");
              setMessage("");
              getMemos();
            }
          
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      // Function to fetch all memos stored on-chain.
      const getMemos = async () => {
        try { 
          const  {ethereum}  = window;
          // const {check} = ethers.providers.getNetwork(11155111)
          let n = ethereum.chainId 
          // console.log("get memos chain:", n)
          // console.log("window",ethereum)
          // console.log("check",check)
          if (ethereum) {
            //console.log("gettin memos")
            const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
            const signer = provider.getSigner();

            const buyMeACoffee = new ethers.Contract(
              contractAddress,
              contractABI,
               signer
            );
            console.log("buyMeACoffee",buyMeACoffee)
            
         
            const memos = await buyMeACoffee.getMemos();
        
         
            setMemos(memos);
        
          } else {
            //console.log("Metamask is not connected Memo");
          }
          
        } catch (error) {
          console.log(error);
        }
      };
      
      useEffect(() => {
        let buyMeACoffee;
        isWalletConnected();
        // getMemos();
    
        // Create an event handler function for when someone sends
        // us a new memo.
        const onNewMemo = (from, timestamp, name, message) => {
          console.log("Memo received: ", from, timestamp, name, message);
          setMemos((prevState) => [
            ...prevState,
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message,
              name
            }
          ]);
        };
    
        const {ethereum} = window;
        
    
        // Listen for new memo events.
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum, "any");
          const signer = provider.getSigner();
          buyMeACoffee = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
    
          buyMeACoffee.on("NewMemo", onNewMemo);
        }
    
        return () => {
          if (buyMeACoffee) {
            buyMeACoffee.off("NewMemo", onNewMemo);
          }
        }
      }, []);
    
  return (
    <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"

    justify="center"
    style={{ minHeight: '100vh',marginTop:20 }}
   >
  
    <Grid item xs={3}>
            <Card sx={{ maxWidth: 500 }}>
            <CardActionArea>
            <CardMedia
                component="img"
                height="500"
                image={coffee}
                alt="Coffee"
            />
          
                {currentAccount ? (
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    Keep a developer awake... Buy a Coffee
                    </Typography>
                    <TextField
                      required
                      id="standard-required"
                      label="Name"
                      defaultValue=""
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                      fullWidth 
                    />
                    <TextField
                      required
                      id="outlined-multiline-static"
                      label="Message"
                      defaultValue=""
                      value={message}
                      onChange={(event) => {
                        setMessage(event.target.value);
                      }}
                    
                      fullWidth 
                      margin="normal" 
                      multiline
                      rows={4}
                      helperText="Inspire your Developer"
                    />
                    <Button onClick={buyCoffeeNow} variant="outlined" style={{backgroundColor:'#E1C9A9', color:'white', borderBlockColor:'#432D2D'}}>
                      Send  0.001Eth
                    </Button>
                
                </CardContent>
                ):(
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        Keep a developer awake... Buy a Coffee
                        </Typography>
                        <Button variant="outlined" onClick={connectWallet}>Connect Wallet</Button>
              
                    </CardContent>
                )}
              
              
            </CardActionArea>
        </Card>
    </Grid>      
    <Grid item xs={3}>
      {currentAccount &&( 
        <Typography gutterBottom variant="h3" component="div">
          Inspirational Messages
        </Typography>
      )}
      {currentAccount &&(
        memos.map((memo, idx)=>{
          return(
            <Card sx={{ minWidth: 275 }}  style={{marginTop:10, backgroundColor:"#BCC4C7"}} >
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="#A9612B" gutterBottom>
                 {memo.name}
                </Typography>
             
                <Typography variant="body2" color="white">
                  {memo.message}
                </Typography>
              </CardContent>
          
            </Card>
          )
        })
      )}
    </Grid>
 </Grid>
  )
}

export default BuyCoffee