import { ethers } from 'ethers';
import PredictionMarketABI from './contracts/PredictionMarket.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_FLUENT_RPC;
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);

// Get provider (read-only)
export const getProvider = () => {
  return new ethers.JsonRpcProvider(RPC_URL);
};

// Get signer (for transactions - requires MetaMask)
export const getSigner = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
};

// Get contract instance (read-only)
export const getContract = () => {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI, provider);
};

// Get contract instance with signer (for transactions)
export const getContractWithSigner = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, PredictionMarketABI, signer);
};

// Check if wallet is connected
export const isWalletConnected = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};

// Connect wallet
export const connectWallet = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    // Check if on correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId, 16);

    if (currentChainId !== CHAIN_ID) {
      await switchNetwork();
    }

    return accounts[0];
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Switch to Fluent Testnet
export const switchNetwork = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${CHAIN_ID.toString(16)}`,
              chainName: 'Fluent Testnet',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [RPC_URL],
              blockExplorerUrls: ['https://testnet.fluentscan.xyz/'],
            },
          ],
        });
      } catch (addError) {
        console.error('Error adding network:', addError);
        throw addError;
      }
    } else {
      throw switchError;
    }
  }
};

// Format ETH amount
export const formatEth = (value) => {
  return ethers.formatEther(value);
};

// Parse ETH amount
export const parseEth = (value) => {
  return ethers.parseEther(value);
};

// Get current connected account
export const getCurrentAccount = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Check if user is admin
export const isAdmin = async (address) => {
  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
  return address && address.toLowerCase() === adminAddress.toLowerCase();
};