import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";

// GET for Inventory /api/v1/reward/inventory
export async function GET(req: NextRequest) { 
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // --- 1. Find all Gacha pulls for this user and include the Item details ---
        const gachaPulls = await prisma.gacha.findMany({
            where: { userId },
            select: {
                item: { // Selects the related Item object
                    select: {
                        id: true,
                        name: true,
                        imageURL: true,
                        rarity: true,
                        description: true,
                    },
                },
            },
        });

        // --- 2. Aggregate / Group the items to show count (e.g., "Sword x 3") ---
        const inventoryMap = new Map<string, { item: typeof gachaPulls[0]['item'], count: number }>();

        for (const pull of gachaPulls) {
            const itemId = pull.item.id;
            
            if (inventoryMap.has(itemId)) {
                // Increment count if item already exists
                inventoryMap.get(itemId)!.count += 1;
            } else {
                // Add new item to the map
                inventoryMap.set(itemId, { item: pull.item, count: 1 });
            }
        }

        // --- 3. Convert the Map into a clean Array for the response ---
        const inventory = Array.from(inventoryMap.values()).map(entry => ({
            ...entry.item,
            count: entry.count
        }));

        // If the array is empty, the inventory is empty, return 200 OK with empty array
        return NextResponse.json(inventory, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return NextResponse.json(
            { error: "Error Fetching inventory" },
            { status: 500 }
        );
    }
}