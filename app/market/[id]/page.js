'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useWeb3 } from '@/context/Web3Context';
import { getContractWithSigner, formatEth, parseEth } from '@/lib/web3';

export default function MarketDetail() {
  const params = useParams();
  const router = useRouter();
  const { account, isConnected, connect } = useWeb3();
  
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [userBet, setUserBet] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchMarket();
      if (account) {
        fetchUserBet();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, account]);

  const fetchMarket = async () => {
    try {
      const res = await fetch(`/api/markets/${params.id}`);
      const data = await res.json();
      
      if (data.success) {
        setMarket(data.data);
      }
    } catch (error) {
      console.error('Error fetching market:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBet = async () => {
    try {
      const res = await fetch(`/api/bets?marketId=${params.id}&userAddress=${account}`);
      const data = await res.json();
      
      if (data.success && data.data.length > 0) {
        setUserBet(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching user bet:', error);
    }
  };

  const handlePlaceBet = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    if (!betAmount || parseFloat(betAmount) < 0.005 || parseFloat(betAmount) > 2) {
      alert('Bet amount must be between 0.005 and 2 ETH');
      return;
    }

    if (!selectedPrediction) {
      alert('Please select YES or NO');
      return;
    }

    try {
      setPlacing(true);

      const contract = await getContractWithSigner();
      const amount = parseEth(betAmount);
      const prediction = selectedPrediction === 'YES' ? 0 : 1;

      const tx = await contract.placeBet(params.id, prediction, { value: amount });
      await tx.wait();

      // Save bet to database
      await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketId: params.id,
          userAddress: account,
          amount: betAmount,
          prediction: selectedPrediction,
          txHash: tx.hash
        })
      });

      alert('Bet placed successfully!');
      fetchMarket();
      fetchUserBet();
      setBetAmount('');
      setSelectedPrediction(null);
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet: ' + error.message);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-400 text-lg">Market not found</p>
        </div>
      </div>
    );
  }

  const totalVolume = parseFloat(market.totalYesAmount || '0') + parseFloat(market.totalNoAmount || '0');
  const yesPercentage = totalVolume > 0 
    ? ((parseFloat(market.totalYesAmount || '0') / totalVolume) * 100).toFixed(1)
    : 50;
  const noPercentage = totalVolume > 0
    ? ((parseFloat(market.totalNoAmount || '0') / totalVolume) * 100).toFixed(1)
    : 50;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => router.back()}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center"
        >
          ← Back to Markets
        </button>

        {/* Market Info */}
        <div className="bg-gray-800 rounded-xl p-8 mb-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-4">{market.question}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <span className={`${market.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
              {market.status}
            </span>
            <span className="text-gray-400 text-sm">
              Market #{market.marketId}
            </span>
          </div>

          {/* YES/NO Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-lg mb-3">
              <span className="text-green-400 font-bold">YES {yesPercentage}%</span>
              <span className="text-red-400 font-bold">NO {noPercentage}%</span>
            </div>
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden flex">
              <div 
                className="bg-green-500 transition-all duration-300"
                style={{ width: `${yesPercentage}%` }}
              ></div>
              <div 
                className="bg-red-500 transition-all duration-300"
                style={{ width: `${noPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Volume</p>
              <p className="text-white text-xl font-bold">{totalVolume.toFixed(4)} ETH</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Participants</p>
              <p className="text-white text-xl font-bold">{market.participantCount || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Ends</p>
              <p className="text-white text-xl font-bold">
                {new Date(market.endTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* User's Bet (if exists) */}
        {userBet && (
          <div className="bg-blue-900 border border-blue-700 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-2">Your Bet</h3>
            <p className="text-blue-200">
              You bet <span className="font-bold">{userBet.amount} ETH</span> on{' '}
              <span className={`font-bold ${userBet.prediction === 'YES' ? 'text-green-400' : 'text-red-400'}`}>
                {userBet.prediction}
              </span>
            </p>
          </div>
        )}

        {/* Place Bet Section */}
        {market.status === 'ACTIVE' && !userBet && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Place Your Bet</h2>

            {/* Prediction Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSelectedPrediction('YES')}
                className={`p-6 rounded-xl border-2 transition ${
                  selectedPrediction === 'YES'
                    ? 'border-green-500 bg-green-500 bg-opacity-20'
                    : 'border-gray-600 hover:border-green-500'
                }`}
              >
                <p className="text-green-400 text-2xl font-bold">YES</p>
                <p className="text-gray-400 text-sm mt-2">{yesPercentage}% of pool</p>
              </button>
              <button
                onClick={() => setSelectedPrediction('NO')}
                className={`p-6 rounded-xl border-2 transition ${
                  selectedPrediction === 'NO'
                    ? 'border-red-500 bg-red-500 bg-opacity-20'
                    : 'border-gray-600 hover:border-red-500'
                }`}
              >
                <p className="text-red-400 text-2xl font-bold">NO</p>
                <p className="text-gray-400 text-sm mt-2">{noPercentage}% of pool</p>
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">Bet Amount (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0.005"
                max="2"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="0.005 - 2 ETH"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-500 text-xs mt-2">Min: 0.005 ETH | Max: 2 ETH</p>
            </div>

            {/* Place Bet Button */}
            <button
              onClick={handlePlaceBet}
              disabled={placing || !betAmount || !selectedPrediction}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing ? 'Placing Bet...' : isConnected ? 'Place Bet' : 'Connect Wallet to Bet'}
            </button>
          </div>
        )}

        {market.status !== 'ACTIVE' && (
          <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
            <p className="text-gray-400 text-lg">
              {market.status === 'ENDED' && 'This market has ended. Waiting for resolution.'}
              {market.status === 'RESOLVED' && `This market is resolved. Winner: ${market.winner}`}
              {market.status === 'CANCELLED' && 'This market has been cancelled.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}