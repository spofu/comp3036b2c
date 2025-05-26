// API route for forgot password functionality

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    // Always return success message for security
    // Don't reveal whether email exists or not
    const successMessage = 'If an account with that email exists, we have sent you a password reset link.';

    if (!user) {
      return NextResponse.json({
        success: true,
        message: successMessage
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    // Note: You might want to create a separate table for password reset tokens
    // For now, we'll add it to the user model (you'll need to add these fields to your schema)
    
    // TODO: Add resetToken and resetTokenExpiry fields to User model in schema.prisma
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     resetToken,
    //     resetTokenExpiry
    //   }
    // });

    // TODO: Send password reset email
    // You would typically use a service like SendGrid, AWS SES, or similar
    // await sendPasswordResetEmail(user.email, user.name, resetToken);

    console.log(`Password reset requested for ${email}`);
    console.log(`Reset token (for development): ${resetToken}`);

    return NextResponse.json({
      success: true,
      message: successMessage
    });

  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
