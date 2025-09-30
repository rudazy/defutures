import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Market from '@/models/Market';

// GET single market by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const marketId = params.id;
    const market = await Market.findOne({ marketId: parseInt(marketId) }).lean();

    if (!market) {
      return NextResponse.json(
        { success: false, error: 'Market not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: market
    });
  } catch (error) {
    console.error('Error fetching market:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market' },
      { status: 500 }
    );
  }
}

// PATCH - Update market
export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const marketId = params.id;
    const body = await request.json();

    const market = await Market.findOneAndUpdate(
      { marketId: parseInt(marketId) },
      body,
      { new: true, runValidators: true }
    );

    if (!market) {
      return NextResponse.json(
        { success: false, error: 'Market not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: market
    });
  } catch (error) {
    console.error('Error updating market:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update market' },
      { status: 500 }
    );
  }
}