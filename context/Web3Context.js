'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, getCurrentAccount, isAdmin, switchNetwork } from '@/lib/web3';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      const currentAccount = await getCurrentAccount();
      if (currentAccount) {
        setAccount(currentAccount);
        setIsConnected(true);
        const adminStatus = await isAdmin(currentAccount);
        setIsUserAdmin(adminStatus);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      setAccount(null);
      setIsConnected(false);
      setIsUserAdmin(false);
    } else {
      // User switched account
      setAccount(accounts[0]);
      setIsConnected(true);
      const adminStatus = await isAdmin(accounts[0]);
      setIsUserAdmin(adminStatus);
    }
  };

  const connect = async () => {
    try {
      setIsLoading(true);
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      setIsConnected(true);
      const adminStatus = await isAdmin(connectedAccount);
      setIsUserAdmin(adminStatus);
      return connectedAccount;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setIsUserAdmin(false);
  };

  const switchToFluentNetwork = async () => {
    try {
      await switchNetwork();
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  const value = {
    account,
    isConnected,
    isUserAdmin,
    isLoading,
    connect,
    disconnect,
    switchToFluentNetwork
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};