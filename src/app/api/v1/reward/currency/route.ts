import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";

// GET to fetch current user's currency /api/v1/reward/currency
export async function GET(req: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const userCurrency = await prisma.currency.findUnique({
            where: { userId },
            select: { amount: true },
        });

        const amount = userCurrency ? userCurrency.amount : 0;
        return NextResponse.json({ currency: amount }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching user currency:", error);
        return NextResponse.json({ error: "Error fetching currency" }, { status: 500 });
    }
}