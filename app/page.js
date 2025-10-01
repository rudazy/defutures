'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MarketCard from '@/components/MarketCard';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ACTIVE');

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch markets
      const marketsRes = await fetch(`/api/markets?status=${filter}`);
      const marketsData = await marketsRes.json();
      
      if (marketsData.success) {
        setMarkets(marketsData.data);
      }

      // Fetch stats
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <HeroSection />
      
      <StatsSection stats={stats} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="markets">
        {/* Markets Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Prediction Markets</h2>
            
            {/* Filter Tabs */}
            <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
              {['ACTIVE', 'ENDED', 'RESOLVED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Markets Grid */}
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