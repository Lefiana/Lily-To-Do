// app/api/user/set-theme/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getUserIdFromSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    console.log('API /api/user/set-theme called');
    const userId = await getUserIdFromSession();
    if (!userId) {
        console.log('Unauthorized: No userId'); // 🎯 Debug
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await req.json();
    console.log('Received itemId:', itemId); // 🎯 Debug

    // Update user's active theme, allowing itemId to be null
    await prisma.user.update({
        where: { id: userId },
        data: { activeThemeItemId: itemId }, // This can be null
    });

    return NextResponse.json({ message: "Theme updated successfully" }, { status: 200 });
}
