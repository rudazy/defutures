'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [market.endTime]);

  const totalVolume = parseFloat(market.totalYesAmount || '0') + parseFloat(market.totalNoAmount || '0');
  const yesPercentage = totalVolume > 0 
    ? ((parseFloat(market.totalYesAmount || '0') / totalVolume) * 100).toFixed(1)
    : 50;
  const noPercentage = totalVolume > 0
    ? ((parseFloat(market.totalNoAmount || '0') / totalVolume) * 100).toFixed(1)
    : 50;

  const getStatusStyles = (status) => {
    const styles = {
      ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      ENDED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      RESOLVED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return styles[status] || styles.ACTIVE;
  };

  return (
    <Link href={`/market/${market.marketId}`}>
      <div className="glass-card rounded-2xl p-6 card-hover border border-gray-700/50 group relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border",
              getStatusStyles(market.status)
            )}>
              {market.status}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{timeRemaining}</span>
            </div>
          </div>

          {/* Question */}
          <h3 className="text-lg font-semibold text-white mb-4 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {market.question}
          </h3>

          {/* Probability Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                YES {yesPercentage}%
              </span>
              <span className="text-red-400 font-semibold">NO {noPercentage}%</span>
            </div>
            
            {/* Animated progress bar */}
            <div className="relative w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full gradient-success transition-all duration-500 ease-out rounded-full"
                style={{ width: `${yesPercentage}%` }}
              />
              <div 
                className="absolute right-0 top-0 h-full gradient-danger transition-all duration-500 ease-out rounded-full"
                style={{ width: `${noPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-white font-medium">{market.participantCount || 0}</span>
              </div>
              <div className="text-gray-400">
                Volume: <span className="text-white font-medium">{totalVolume.toFixed(4)} ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}