'use client';

import { TrendingUp, Users, BarChart3, DollarSign } from 'lucide-react';

export default function StatsSection({ stats }) {
  const statItems = [
    {
      icon: BarChart3,
      label: 'Active Markets',
      value: stats?.activeMarkets || 0,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      label: 'Total Participants',
      value: stats?.totalParticipants || 0,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: DollarSign,
      label: 'Total Volume',
      value: `${stats?.totalVolume || '0'} ETH`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      label: 'Total Markets',
      value: stats?.totalMarkets || 0,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="py-12 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Platform Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}