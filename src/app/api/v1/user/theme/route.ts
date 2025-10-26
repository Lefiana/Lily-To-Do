// app/api/user/theme/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getUserIdFromSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');
    if (requestedUserId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userWithTheme = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            activeThemeItem: {
                select: {
                    imageURL: true,
                    color1: true,
                    color2: true,
                }
            }
        }
    });

    const themeData = {
        backgroundUrl: userWithTheme?.activeThemeItem?.imageURL || null,
        color1: userWithTheme?.activeThemeItem?.color1 || null,
        color2: userWithTheme?.activeThemeItem?.color2 || null,
    };

    return NextResponse.json(themeData, { status: 200 });
}
