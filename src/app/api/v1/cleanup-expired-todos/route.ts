import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // Your Prisma client

export async function GET() {
  try {
    const now = new Date();
    
    // Bulk delete expired urgent tasks using Prisma
    const result = await prisma.todo.deleteMany({
      where: {
        dailyQuest: true,      // Only urgent tasks
        completed: false,      // Not completed
        deadline: { lt: now }, // Deadline has passed
      },
    });

    console.log(`Deleted ${result.count} expired urgent tasks.`);
    return NextResponse.json({ message: `Deleted ${result.count} tasks.` });
  } catch (error) {
    console.error('Error deleting expired tasks:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}