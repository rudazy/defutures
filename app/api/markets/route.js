import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Market from '@/models/Market';

// GET all markets
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = {};
    if (status) {
      query.status = status;
    }

    const markets = await Market.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: markets
    });
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch markets' },
      { status: 500 }
    );
  }
}

// POST - Create new market
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { marketId, question, endTime, contractAddress } = body;

    const market = await Market.create({
      marketId,
      question,
      endTime: new Date(endTime * 1000), // Convert from Unix timestamp
      contractAddress,
      status: 'ACTIVE'
    });

    return NextResponse.json({
      success: true,
      data: market
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating market:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create market' },
      { status: 500 }
    );
  }
}