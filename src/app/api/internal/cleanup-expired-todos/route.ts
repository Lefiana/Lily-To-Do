// lily/src/app/api/v1/cleanup-expired-todos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEPLOYMENT_HOST = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL; 
// NEXT_PUBLIC_VERCEL_URL if you exposed it client-side; fallback to VERCEL_URL.

export async function GET(req: Request) {
  // Ensure this runs only on Vercel (prevents arbitrary external runs in other environments)
  if (!process.env.VERCEL) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Optional: extra check that Host matches your deployment hostname (adds some assurance)
  // Note: Do not rely on host as a definitive auth method, it's an additional heuristic.
  if (DEPLOYMENT_HOST) {
    const hostHeader = req.headers.get('host') || '';
    if (!hostHeader.includes(DEPLOYMENT_HOST)) {
      console.warn('Host header mismatch', { hostHeader, DEPLOYMENT_HOST });
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    const now = new Date();
    const result = await prisma.todo.deleteMany({
      where: {
        completed: true,
        updatedAt: { lt: now },
      },
    });

    console.log(`Deleted ${result.count} expired tasks.`);
    return NextResponse.json({ message: `Deleted ${result.count} tasks.` });
  } catch (error) {
    console.error('Error deleting expired tasks:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
