import  React, { createContext, useEffect, useState } from 'react';
import { ethers } from "ethers";
import abi from '../contracts/BuyMeACoffee.json'

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('')
    const isWalletConnected = async () => {
        try {
            const { ethereum } = window;

            const accounts = await ethereum.request({method: 'eth_accounts'})
            console.log("accounts: ", accounts);

            if (accounts.length > 0) {
                const account = accounts[0];
                console.log("wallet is connected! " + account);
            } else {
                console.log("make sure MetaMask is connected");
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

  
    return (
      <WalletContext.Provider
        value={{
   
          isWalletConnected,
  
          currentAccount,
   
 
  
      
  
        }}
      >
        {children}
      </WalletContext.Provider>
    )
  }