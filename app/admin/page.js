'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useWeb3 } from '@/context/Web3Context';
import { getContractWithSigner } from '@/lib/web3';

export default function AdminPage() {
  const router = useRouter();
  const { account, isConnected, isUserAdmin, connect } = useWeb3();
  
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Create Market Form
  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState('');
  const [durationType, setDurationType] = useState('hours');

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    if (isConnected && !isUserAdmin) {
      alert('Access denied: Admin only');
      router.push('/');
      return;
    }

    fetchMarkets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isUserAdmin, router]);

  const fetchMarkets = async () => {
    try {
      const res = await fetch('/api/markets');
      const data = await res.json();
      
      if (data.success) {
        setMarkets(data.data);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMarket = async (e) => {
    e.preventDefault();

    if (!question || !duration) {
      alert('Please fill all fields');
      return;
    }

    try {
      setCreating(true);

      // Convert duration to seconds
      let durationInSeconds = parseInt(duration);
      if (durationType === 'minutes') {
        durationInSeconds *= 60;
      } else if (durationType === 'hours') {
        durationInSeconds *= 3600;
      } else if (durationType === 'days') {
        durationInSeconds *= 86400;
      }

      // Create market on blockchain
      const contract = await getContractWithSigner();
      const tx = await contract.createMarket(question, durationInSeconds);
      const receipt = await tx.wait();

      // Get marketId from event
      const event = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log).name === 'MarketCreated';
        } catch {
          return false;
        }
      });

      const parsedEvent = contract.interface.parseLog(event);
      const marketId = parsedEvent.args.marketId.toString();
      const endTime = parsedEvent.args.endTime.toString();

      // Save to database
      await fetch('/api/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketId,
          question,
          endTime,
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        })
      });

      alert('Market created successfully!');
      setQuestion('');
      setDuration('');
      fetchMarkets();
    } catch (error) {
      console.error('Error creating market:', error);
      alert('Failed to create market: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleResolveMarket = async (marketId, winner) => {
    if (!confirm(`Are you sure you want to resolve market #${marketId} with winner: ${winner}?`)) {
      return;
    }

    try {
      const contract = await getContractWithSigner();
      const prediction = winner === 'YES' ? 0 : 1;
      
      const tx = await contract.resolveMarket(marketId, prediction);
      await tx.wait();

      // Update database
      await fetch(`/api/markets/${marketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RESOLVED',
          resolved: true,
          winner
        })
      });

      alert('Market resolved successfully!');
      fetchMarkets();
    } catch (error) {
      console.error('Error resolving market:', error);
      alert('Failed to resolve market: ' + error.message);
    }
  };

  const handleCancelMarket = async (marketId) => {
    if (!confirm(`Are you sure you want to cancel market #${marketId}? All bets will be refunded.`)) {
      return;
    }

    try {
      const contract = await getContractWithSigner();
      const tx = await contract.cancelMarket(marketId);
      await tx.wait();

      // Update database
      await fetch(`/api/markets/${marketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED'
        })
      });

      alert('Market cancelled successfully!');
      fetchMarkets();
    } catch (error) {
      console.error('Error cancelling market:', error);
      alert('Failed to cancel market: ' + error.message);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-400 mb-6">Please connect your wallet to access the admin panel</p>
          <button
            onClick={connect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400">You do not have admin privileges</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Create and manage prediction markets</p>
        </div>

        {/* Create Market Form */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Market</h2>
          
          <form onSubmit={handleCreateMarket}>
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Will Bitcoin reach $100k by end of 2025?"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Duration</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="24"
                  min="1"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Time Unit</label>
                <select
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50"
            >
              {creating ? 'Creating Market...' : 'Create Market'}
            </button>
          </form>
        </div>

        {/* Markets List */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Manage Markets</h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : markets.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No markets created yet</p>
          ) : (
            <div className="space-y-4">
              {markets.map((market) => (
                <div key={market.marketId} className="bg-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">{market.question}</h3>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className={`${
                          market.status === 'ACTIVE' ? 'bg-green-500' :
                          market.status === 'ENDED' ? 'bg-yellow-500' :
                          market.status === 'RESOLVED' ? 'bg-blue-500' :
                          'bg-red-500'
                        } text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                          {market.status}
                        </span>
                        <span className="text-gray-400">Market #{market.marketId}</span>
                        <span className="text-gray-400">
                          {market.participantCount || 0} participants
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {market.status === 'ACTIVE' || market.status === 'ENDED' ? (
                    <div className="flex space-x-3">
                      {(market.status === 'ENDED' || new Date(market.endTime) < new Date()) && (
                        <>
                          <button
                            onClick={() => handleResolveMarket(market.marketId, 'YES')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            Resolve: YES
                          </button>
                          <button
                            onClick={() => handleResolveMarket(market.marketId, 'NO')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            Resolve: NO
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleCancelMarket(market.marketId)}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Cancel Market
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      {market.status === 'RESOLVED' && `Winner: ${market.winner}`}
                      {market.status === 'CANCELLED' && 'Market cancelled - all bets refunded'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}