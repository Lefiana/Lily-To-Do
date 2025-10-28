//api/v1/reward/gacha
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";
import { REWARD_CONFIG } from "@/lib/constants"; 
import { selectRandomItem } from "@/lib/gacha";
import { Role } from "@prisma/client";

// Define the cost for this specific gacha
const GACHA_COST = REWARD_CONFIG.GACHA_COST || 2000;

export async function POST(_req: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure only admin users can access this route
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    if (user?.role !== Role.ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    try {
        // --- 1. Fetch all Items from DB to create the dynamic pool ---
        const availableItems = await prisma.item.findMany({
            // Ensure you fetch all fields required by your selectRandomItem function (id, name, rarity, imageURL)
            select: { id: true, name: true, rarity: true, imageURL: true }, 
        });

        if (availableItems.length === 0) {
            return NextResponse.json({ error: "No items available in the gacha pool" }, { status: 500 });
        }
        
        // --- 2. Perform Weighted Selection (Inside the function, after fetching data) ---
        const drawnItem = selectRandomItem(availableItems); 

        // --- 3. Perform Atomic Transaction (Check Balance, Deduct, Record) ---
        const result = await prisma.$transaction(async (tx) => {
            // A. Check Current Currency Balance (Code remains the same)
            const userCurrency = await tx.currency.findUnique({
                where: { userId },
                select: { amount: true },
            });

            const currentAmount = userCurrency?.amount || 0;

            if (currentAmount < GACHA_COST) {
                throw new Error("Insufficient Coins"); 
            }

            // B. Deduct Currency (🔒 Atomic Operation)
            await tx.currency.update({
                where: { userId },
                data: { amount: { decrement: GACHA_COST } },
            });

            // C. Record the Gacha Pull
            await tx.gacha.create({
                data: {
                    userId,
                    itemId: drawnItem.id, // Use the ID from the selected item
                },
            });
            
            return {
                item: drawnItem,
                newBalance: currentAmount - GACHA_COST,
            };
        });

        // --- 4. Success Response ---
        return NextResponse.json({ 
            message: "Gacha pull successful!", 
            item: result.item,
            newBalance: result.newBalance
        }, { status: 200 });

        } catch (error: unknown) {
            console.error("Error performing gacha:", error);

            if (error instanceof Error && error.message === "Insufficient Coins") {
                return NextResponse.json(
                    { error: "Insufficient currency to perform gacha pull." },
                    { status: 402 }
                );
            }

            return NextResponse.json(
                { error: "Failed to perform gacha pull" },
                { status: 500 }
            );
        }
}