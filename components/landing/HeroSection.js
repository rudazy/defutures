'use client';

import { useWeb3 } from '@/context/Web3Context';

export default function HeroSection({ stats }) {
  const { connect, isConnected } = useWeb3();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
          <span className="text-purple-400 text-2xl">✨</span>
          <span className="text-purple-300 text-sm font-semibold">Live on Fluent Testnet</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Predict the Future,
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Win Rewards
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Trade on what you believe in. Join thousands making predictions on crypto, 
          sports, and world events. Your insights could be worth real money.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!isConnected ? (
            <button onClick={connect} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105">
              Connect Wallet & Start Trading
            </button>
          ) : (
            <a href="#markets" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105">
              Explore Markets
            </a>
          )}
          
          <a href="https://x.com/DeFuturesx" target="_blank" rel="noopener noreferrer" className="border-2 border-gray-700 hover:border-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-2">
            <span>Follow on X</span>
            <span className="text-xl">X</span>
          </a>
        </div>

        {/* Real Stats with Decorative Line */}
        <div className="mt-16 relative">
          <div className="absolute top-0 left-0 right-0 h-px">
            <div className="h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                {stats?.activeMarkets || 0}
              </div>
              <div className="text-sm text-gray-400">Active Markets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
                {stats?.totalParticipants || 0}
              </div>
              <div className="text-sm text-gray-400">Total Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                {stats?.totalVolume || '0'} ETH
              </div>
              <div className="text-sm text-gray-400">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">
                2%
              </div>
              <div className="text-sm text-gray-400">Platform Fee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}