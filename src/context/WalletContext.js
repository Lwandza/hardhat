import  React, { createContext, useEffect, useState } from 'react';
import { ethers } from "ethers";


export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('')
    const [formattedAccount, setFormattedAccount] = useState('')
    const [userBalance, setUserBalance] = useState([]);
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
                  const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
                  const balance= await provider.getBalance(account)
                  console.log("balance", parseFloat(balance/(Math.pow(10,18))))
                  setUserBalance(parseFloat(balance/(Math.pow(10,18))))
                  let formatAccount = account.slice(0, 4) + '...' + account.slice(-4)
                  setFormattedAccount(formatAccount)
                  // getLockperiods(account)
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
                const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
                const balance= await provider.getBalance(account)
                console.log("balance", parseFloat(balance/(Math.pow(10,18))))
                setUserBalance(parseFloat(balance/(Math.pow(10,18))))
                let formatAccount = account.slice(0, 4) + '...' + account.slice(-4)
                setFormattedAccount(formatAccount)
                // getLockperiods(account)
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
    const handleAuth = async () => {
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
            
              let formatAccount = accounts[0].slice(0, 4) + '...' + accounts[0].slice(-4)
              setFormattedAccount(formatAccount)
              const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
              setCurrentAccount(accounts[0])
              const balance= await provider.getBalance(accounts[0])
              console.log("balance", parseFloat(balance/(Math.pow(10,18))))
              setUserBalance(parseFloat(balance/(Math.pow(10,18))))
              
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
          
            let formatAccount = accounts[0].slice(0, 4) + '...' + accounts[0].slice(-4)
            setFormattedAccount(formatAccount)
            const provider = new ethers.providers.Web3Provider(ethereum, "sepolia");
            const balance= await provider.getBalance(accounts[0])
            console.log("balance", parseFloat(balance/(Math.pow(10,18))))
            setUserBalance(parseFloat(balance/(Math.pow(10,18))))
   
          }
  
          
        }
  
      
      } catch (error) {
        console.log(error);
      }
      
  
  
    };

  
    return (
      <WalletContext.Provider
        value={{
          handleAuth,
          isWalletConnected,
          formattedAccount,
          currentAccount,
          userBalance
   
 
  
      
  
        }}
      >
        {children}
      </WalletContext.Provider>
    )
  }