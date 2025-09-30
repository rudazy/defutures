import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bet from '@/models/Bet';
import Market from '@/models/Market';
import User from '@/models/User';

// GET bets (with optional filters)
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const marketId = searchParams.get('marketId');
    const userAddress = searchParams.get('userAddress');

    let query = {};
    if (marketId) query.marketId = parseInt(marketId);
    if (userAddress) query.userAddress = userAddress.toLowerCase();

    const bets = await Bet.find(query)
      .sort({ timestamp: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: bets
    });
  } catch (error) {
    console.error('Error fetching bets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bets' },
      { status: 500 }
    );
  }
}

// POST - Create new bet
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { marketId, userAddress, amount, prediction, txHash } = body;

    // Create bet
    const bet = await Bet.create({
      marketId: parseInt(marketId),
      userAddress: userAddress.toLowerCase(),
      amount,
      prediction,
      txHash,
      timestamp: new Date()
    });

    // Update market stats
    const updateField = prediction === 'YES' ? 'totalYesAmount' : 'totalNoAmount';
    const market = await Market.findOne({ marketId: parseInt(marketId) });
    
    if (market) {
      const currentAmount = parseFloat(market[updateField] || '0');
      const newAmount = (currentAmount + parseFloat(amount)).toString();
      
      market[updateField] = newAmount;
      market.totalVolume = (parseFloat(market.totalYesAmount || '0') + parseFloat(market.totalNoAmount || '0')).toString();
      market.participantCount += 1;
      
      await market.save();
    }

    // Update user stats
    let user = await User.findOne({ address: userAddress.toLowerCase() });
    
    if (!user) {
      user = await User.create({
        address: userAddress.toLowerCase(),
        totalBets: 1,
        totalVolume: amount,
        marketsParticipated: [parseInt(marketId)]
      });
    } else {
      user.totalBets += 1;
      user.totalVolume = (parseFloat(user.totalVolume) + parseFloat(amount)).toString();
      
      if (!user.marketsParticipated.includes(parseInt(marketId))) {
        user.marketsParticipated.push(parseInt(marketId));
      }
      
      user.lastActive = new Date();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      data: bet
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating bet:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bet' },
      { status: 500 }
    );
  }
}