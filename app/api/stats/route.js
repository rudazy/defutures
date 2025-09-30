import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Market from '@/models/Market';
import User from '@/models/User';

// GET platform stats
export async function GET(request) {
  try {
    await dbConnect();

    // Count active markets
    const activeMarkets = await Market.countDocuments({ status: 'ACTIVE' });

    // Total participants (unique users)
    const totalParticipants = await User.countDocuments();

    // Calculate total volume across all markets
    const markets = await Market.find({});
    let totalVolume = 0;
    
    markets.forEach(market => {
      const yesAmount = parseFloat(market.totalYesAmount || '0');
      const noAmount = parseFloat(market.totalNoAmount || '0');
      totalVolume += yesAmount + noAmount;
    });

    // Get total markets count
    const totalMarkets = await Market.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        activeMarkets,
        totalParticipants,
        totalVolume: totalVolume.toFixed(4),
        totalMarkets
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}