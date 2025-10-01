'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MarketCard from '@/components/MarketCard';
import HeroSection from '@/components/landing/HeroSection';

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ACTIVE');

  const fetchData = async () => {
    try {
      setLoading(true);

      const marketsRes = await fetch(`/api/markets?status=${filter}`);
      const marketsData = await marketsRes.json();
      
      if (marketsData.success) {
        setMarkets(marketsData.data);
      }

      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <HeroSection stats={stats} />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="markets">
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Prediction Markets</h2>
            
            <div className="flex space-x-2 glass-card p-1 rounded-xl">
              {['ACTIVE', 'ENDED', 'RESOLVED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    filter === status
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : markets.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No {filter.toLowerCase()} markets found</p>
              <p className="text-gray-500 text-sm mt-2">Check back later or try a different filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {markets.map((market) => (
                <MarketCard key={market.marketId} market={market} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}