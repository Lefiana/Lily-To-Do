// app/api/timer-presets/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getUserIdFromSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const presets = await prisma.timerPreset.findMany({
    where: { userId },
    select: { id: true, name: true, tasks: true, totalTime: true },
  });

  return NextResponse.json(presets, { status: 200 });
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, tasks, totalTime } = await req.json();
  if (!name || !tasks || typeof totalTime !== 'number') {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const preset = await prisma.timerPreset.create({
    data: { userId, name, tasks, totalTime },
  });

  return NextResponse.json(preset, { status: 201 });
}