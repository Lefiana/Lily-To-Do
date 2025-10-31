// lily/src/app/api/v1/cleanup-expired-todos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // Your Prisma client

export async function GET(req: Request) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const result = await prisma.todo.deleteMany({
      where: {
        completed: true,
        updatedAt: { lt: now },
      },
    });

    console.log(`Deleted ${result.count} expired urgent tasks.`);
    return NextResponse.json({ message: `Deleted ${result.count} tasks.` });
  } catch (error) {
    console.error('Error deleting expired tasks:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
