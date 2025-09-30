'use client';

import { useWeb3 } from '@/context/Web3Context';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const { account, isConnected, isUserAdmin, connect, disconnect, isLoading } = useWeb3();
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-900' : 'bg-white'} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🔮 DeFutures
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition`}
            >
              Markets
            </Link>
            
            {isUserAdmin && (
              <Link 
                href="/admin" 
                className={`${isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'} font-semibold transition`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right side - Theme toggle & Connect button */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:opacity-80 transition`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Connect Wallet Button */}
            {!isConnected ? (
              <button
                onClick={connect}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                {isUserAdmin && (
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    ADMIN
                  </span>
                )}
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} px-4 py-2 rounded-lg`}>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-mono text-sm`}>
                    {shortenAddress(account)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}