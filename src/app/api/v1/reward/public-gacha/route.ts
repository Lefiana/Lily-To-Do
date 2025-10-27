// app/api/v1/reward/public-gacha/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";
import { REWARD_CONFIG } from "@/lib/constants";

const PUBLIC_GACHA_COST = REWARD_CONFIG.PUBLIC_GACHA_COST || 500;

export async function POST(req: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let currencyDeducted = false; // 🎯 Flag to track if we need to rollback

    try {
        // --- 1. Fetch Current Currency and Check Balance ---
        const userCurrency = await prisma.currency.findUnique({
            where: { userId },
            select: { amount: true },
        });

        const currentAmount = userCurrency?.amount || 0;

        if (currentAmount < PUBLIC_GACHA_COST) {
            return NextResponse.json({ error: "Insufficient currency to perform public gacha pull." }, { status: 402 });
        }

        // --- 2. Deduct Currency Atomically ---
        await prisma.currency.update({
            where: { userId },
            data: { amount: { decrement: PUBLIC_GACHA_COST } },
        });
        currencyDeducted = true; // 🎯 Mark as deducted
// app/api/v1/reward/public-gacha/route.ts
// ... (rest of the file unchanged)

        // --- 3. Fetch from Waifu.im API with Timeout ---
        const body = await req.json().catch(() => ({}));
        const { character } = body;

        let tag = 'waifu';
        if (character) {
            tag = character.replace(/ /g, '-').toLowerCase();
            console.log(`Normalized tag: ${tag}`);
        }

        const fullTags = `${tag},selfie`; // e.g., "raiden-shogun,selfie" or "waifu,selfie"
        const url = `https://api.waifu.im/search?included_tags=${encodeURIComponent(fullTags)}&limit=2`;
        console.log(`Using tags: ${fullTags}`); // Debug log

        // 🎯 Add timeout using AbortController (built-in, no extra lib needed)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

        let waifuRes = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal, // Attach abort signal
        });

        clearTimeout(timeoutId); // Clear timeout if successful

        // 🎯 Handle 400 error with fallback
        if (waifuRes.status === 400) {
            console.log(`400 error for "${fullTags}", falling back to "${tag}"`);
            // Fallback: Try without selfie
            const fallbackUrl = `https://api.waifu.im/search?included_tags=${encodeURIComponent(tag)}&limit=2`;
            const fallbackRes = await fetch(fallbackUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: controller.signal, // Reuse controller if needed, or create new
            });
            if (fallbackRes.ok) {
                waifuRes = fallbackRes; // Use fallback response
            } else {
                throw new Error(`Waifu.im API fallback failed: ${fallbackRes.status}`);
            }
        } else if (!waifuRes.ok) {
            throw new Error(`Waifu.im API error: ${waifuRes.status}`);
        }

        const waifuData = await waifuRes.json();
        let image = waifuData.images?.[0];

        // Your existing fallback (if still needed for other cases)
        if (!image && character) {
            console.log(`No results for character "${character}", falling back to tags.`);
            const fallbackUrl = `https://api.waifu.im/search?included_tags=${encodeURIComponent(character.replace(/ /g, '-').toLowerCase())}&limit=2`;
            const fallbackRes = await fetch(fallbackUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });
            if (fallbackRes.ok) {
                const fallbackData = await fallbackRes.json();
                image = fallbackData.images?.[0];
            }
        }

        if (!image) {
            throw new Error("No image returned from Waifu.im");
        }

        const source = image.source || 'unknown';
        const artist = image.artist;
        const artistName = artist?.name || 'unknown';
    
        const credits = `Source: ${source}, Artist: ${artistName}`;

        // --- 4. Format as Item ---
        const itemData = {
            name: character ? `${character} Waifu` : "Random Waifu",
            rarity: 1,
            imageURL: image.url,
            description: `A waifu image from Waifu.im${tag ? ` featuring ${tag}` : ''}. ${credits}`,
        };
        console.log(`Generated name: ${itemData.name}`);

        let existingItem = await prisma.item.findFirst({
            where: { imageURL: image.url },
        });

        let savedItem;
        if (existingItem) {
            savedItem = existingItem;
        } else {
            savedItem = await prisma.item.create({
                data: itemData,
            });
        }

        await prisma.gacha.create({
            data: {
                userId,
                itemId: savedItem.id,
            },
        });

        const item = {
            id: savedItem.id,
            name: savedItem.name,
            rarity: savedItem.rarity,
            imageURL: savedItem.imageURL,
            description: savedItem.description,
        };

        const newBalance = currentAmount - PUBLIC_GACHA_COST;

        return NextResponse.json({
            message: "Public gacha pull successful!",
            item,
            newBalance
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error performing public gacha:", error);

        // 🎯 Rollback currency if deducted but fetch failed
        if (currencyDeducted) {
            try {
                await prisma.currency.update({
                    where: { userId },
                    data: { amount: { increment: PUBLIC_GACHA_COST } }, // Refund
                });
                console.log("Currency refunded due to gacha failure");
            } catch (rollbackError) {
                console.error("Failed to rollback currency:", rollbackError);
            }
        }

        // 🎯 Handle specific errors
        if (error.name === 'AbortError') {
            return NextResponse.json({ error: "Request timed out. Please try again." }, { status: 408 });
        }

        return NextResponse.json({ error: "Failed to perform public gacha pull. Currency has been refunded if deducted." }, { status: 500 });
    }
}
