'use client';
import { useWeb3 } from '@/context/Web3Context';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const { account, isConnected, isUserAdmin, connect, isLoading } = useWeb3();
  
  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">DeFutures</Link>
        <div className="flex items-center space-x-4">
          <a href="https://trustfaucet.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">Get ETH</a>
          {!isConnected ? (
            <button onClick={connect} className="bg-blue-600 text-white px-6 py-2 rounded-lg">{isLoading ? 'Connecting' : 'Connect'}</button>
          ) : (
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-gray-300 text-sm">{account?.slice(0,6)}...{account?.slice(-4)}</div>
          )}
        </div>
      </div>
    </nav>
  );
}