'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarketCard({ market }) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(market.endTime).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeRemaining('Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [market.endTime]);

  const totalVolume = parseFloat(market.totalYesAmount || '0') + parseFloat(market.totalNoAmount || '0');
  const yesPercentage = totalVolume > 0 
    ? ((parseFloat(market.totalYesAmount || '0') / totalVolume) * 100).toFixed(1)
    : 50;
  const noPercentage = totalVolume > 0
    ? ((parseFloat(market.totalNoAmount || '0') / totalVolume) * 100).toFixed(1)
    : 50;

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'ENDED':
        return 'bg-yellow-500';
      case 'RESOLVED':
        return 'bg-blue-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Link href={`/market/${market.marketId}`}>
      <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition cursor-pointer border border-gray-700 hover:border-gray-600">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {market.question}
            </h3>
            <div className="flex items-center space-x-3 text-sm">
              <span className={`${getStatusColor(market.status)} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                {market.status}
              </span>
              <span className="text-gray-400">
                ⏰ {timeRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* YES/NO Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-400 font-semibold">YES {yesPercentage}%</span>
            <span className="text-red-400 font-semibold">NO {noPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden flex">
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Total Volume</p>
            <p className="text-white font-semibold">{totalVolume.toFixed(4)} ETH</p>
          </div>
          <div>
            <p className="text-gray-400">Participants</p>
            <p className="text-white font-semibold">{market.participantCount || 0}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}