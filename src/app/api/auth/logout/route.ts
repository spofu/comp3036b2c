// API route for user logout

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // For JWT-based auth, logout is typically handled client-side
    // by removing the token from localStorage
    // However, we can implement token blacklisting here if needed
    
    // You could add token blacklisting logic here:
    // 1. Extract token from Authorization header
    // 2. Add token to blacklist in database/cache
    // 3. Return success response

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
