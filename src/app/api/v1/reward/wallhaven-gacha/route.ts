// app/api/v1/reward/wallhaven-gacha/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";
import { REWARD_CONFIG } from "@/lib/constants";

const WALLHAVEN_COST = REWARD_CONFIG.WALLHAVEN_GACHA_COST || 1000; // Set cost
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes inactivity expiry

// Global cache for Wallhaven images (in-memory; resets on server restart)
let wallhavenCache: {
  images: any[]; // Array of image objects from API
  lastFetched: number; // Timestamp of last fetch
} = {
  images: [],
  lastFetched: 0,
};

export async function POST(req: NextRequest) {
  console.log('Wallhaven API called'); // 🎯 Debug
  const userId = await getUserIdFromSession();
  if (!userId) {
    console.log('No userId'); // 🎯 Debug
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check balance
    const userCurrency = await prisma.currency.findUnique({
      where: { userId },
      select: { amount: true },
    });
    const currentAmount = userCurrency?.amount || 0;
    if (currentAmount < WALLHAVEN_COST) {
      return NextResponse.json({ error: "Insufficient currency" }, { status: 402 });
    }

    // Check if cache is valid (not empty and not expired)
    const now = Date.now();
    const isCacheValid = wallhavenCache.images.length > 0 && (now - wallhavenCache.lastFetched) < CACHE_EXPIRY_MS;

    if (!isCacheValid) {
      // Fetch from Wallhaven (random sorting, page 1 for 24 results)
      const apiKey = process.env.WALLHAVEN_API_KEY; // Optional: Add to .env
      const url = `https://wallhaven.cc/api/v1/search?sorting=random${apiKey ? `&apikey=${apiKey}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Wallhaven API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data); // 🎯 Debug
      const images = data.data; // Array of 24 images
      if (!images || images.length === 0) {
        throw new Error("No images from Wallhaven");
      }

      // Update cache
      wallhavenCache.images = [...images]; // Copy to avoid mutations
      wallhavenCache.lastFetched = now;
      console.log('Cache updated with', images.length, 'images'); // 🎯 Debug
    }

    // Randomly select and remove from cache (to avoid duplicates)
    const randomIndex = Math.floor(Math.random() * wallhavenCache.images.length);
    const randomImage = wallhavenCache.images.splice(randomIndex, 1)[0]; // Remove and get the image
    console.log('Selected image:', randomImage); // 🎯 Debug
    console.log('Remaining in cache:', wallhavenCache.images.length); // 🎯 Debug

    // Deduct currency
    await prisma.currency.update({
      where: { userId },
      data: { amount: { decrement: WALLHAVEN_COST } },
    });

    // Format as item
    const wallhavenUrl = `https://wallhaven.cc/w/${randomImage.id}`; // Construct the Wallhaven page URL
    const proxiedImageUrl = `/api/v1/proxy-image?url=${encodeURIComponent(randomImage.path)}`;
    const itemData = {
      name: "Wallhaven Wallpaper",
      rarity: 1,
      imageURL: proxiedImageUrl, // Full image URL
      description: `Wallpaper from Wallhaven.cc. Source: ${randomImage.source || wallhavenUrl}. 
      Tags: ${randomImage.tags?.map((t: any) => t.name).join(', ')}.`, // Use Wallhaven URL if no source
    };

    // Save to DB
    let existingItem = await prisma.item.findFirst({
      where: { imageURL: randomImage.path },
    });
    let savedItem;
    if (existingItem) {
      savedItem = existingItem;
    } else {
      savedItem = await prisma.item.create({ data: itemData });
    }

    await prisma.gacha.create({
      data: { userId, itemId: savedItem.id },
    });

    const item = {
      id: savedItem.id,
      name: savedItem.name,
      rarity: savedItem.rarity,
      imageURL: savedItem.imageURL,
      description: savedItem.description,
    };

    const newBalance = currentAmount - WALLHAVEN_COST;
    return NextResponse.json({ message: "Wallhaven gacha successful!", item, newBalance }, { status: 200 });

  } catch (error: any) {
    console.error("Error in Wallhaven gacha:", error); // 🎯 Debug
    // Rollback on error
    if (userId) {
      try {
        await prisma.currency.update({
          where: { userId },
          data: { amount: { increment: WALLHAVEN_COST } },
        });
      } catch {}
    }
    return NextResponse.json({ error: "Failed to perform Wallhaven gacha" }, { status: 500 });
  }
}