import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT secret - in production this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export async function verifyAuthToken(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.headers.get('x-auth-token');

    if (!token) {
      return null;
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser | null> {
  const user = await verifyAuthToken(request);
  
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  
  return user;
}

export function generateJWT(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
