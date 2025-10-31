// app/api/v1/reward/wallhaven-gacha/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";
import { REWARD_CONFIG } from "@/lib/constants";

const WALLHAVEN_COST = REWARD_CONFIG.WALLHAVEN_GACHA_COST || 1000; // Set cost
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes inactivity expiry
const MAX_CACHE_SIZE = 24; // Matches API fetch limit to prevent bloat
const MIN_CACHE_THRESHOLD = 5; // Refresh if below this after selections

// Define types for Wallhaven API response
interface WallhavenTag {
  name: string;
  // Add other properties if needed (e.g., id, category)
}

interface WallhavenImage {
  id: string;
  path: string;
  source?: string;
  tags?: WallhavenTag[];
  // Add other properties if needed (e.g., resolution, colors)
}

// Global cache for Wallhaven images (in-memory; resets on server restart)
const wallhavenCache: {
  images: WallhavenImage[];
  lastFetched: number; // Timestamp of last fetch
} = {
  images: [],
  lastFetched: 0,
};

// Simple counters for portfolio monitoring (resets on cold start)
let apiCallCount = 0;
let cacheHitCount = 0;

export async function POST(_req: NextRequest) {  // Prefixed 'req' with '_' to indicate unused
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

    // Check if cache needs refresh (invalid OR low on images)
    const now = Date.now();
    const isCacheValid = wallhavenCache.images.length > 0 && (now - wallhavenCache.lastFetched) < CACHE_EXPIRY_MS;
    const needsRefresh = !isCacheValid || wallhavenCache.images.length < MIN_CACHE_THRESHOLD;

    if (needsRefresh) {
      apiCallCount++;
      console.log(`API call #${apiCallCount} - Fetching new images`); // Portfolio: Track API usage
      // Fetch from Wallhaven (random sorting, page 1 for 24 results)
      const apiKey = process.env.WALLHAVEN_API_KEY; // Optional: Add to .env
      const url = `https://wallhaven.cc/api/v1/search?sorting=random${apiKey ? `&apikey=${apiKey}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Wallhaven API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data); // 🎯 Debug
      const images = data.data as WallhavenImage[];  // Type assertion for safety
      if (!images || images.length === 0) {
        throw new Error("No images from Wallhaven");
      }

      // Update cache (limit to MAX_CACHE_SIZE)
      wallhavenCache.images = images.slice(0, MAX_CACHE_SIZE);
      wallhavenCache.lastFetched = now;
      console.log(`Cache refreshed with ${wallhavenCache.images.length} images`); // Portfolio: Monitor refreshes
    } else {
      cacheHitCount++;
      console.log(`Cache hit #${cacheHitCount} - Using cached images`); // Portfolio: Track cache efficiency
    }

    // Randomly select and remove from cache (to avoid duplicates)
    const randomIndex = Math.floor(Math.random() * wallhavenCache.images.length);
    const randomImage = wallhavenCache.images.splice(randomIndex, 1)[0]; // Remove and get the image
    console.log(`Selected image ID: ${randomImage.id}, remaining in cache: ${wallhavenCache.images.length}`); // Portfolio: Track selections

    // Deduct currency
    await prisma.currency.update({
      where: { userId },
      data: { amount: { decrement: WALLHAVEN_COST } },
    });

    // Construct URLs
    const wallhavenUrl = `https://wallhaven.cc/w/${randomImage.id}`; // Always available
    const proxiedImageUrl = `/api/v1/proxy-image?url=${encodeURIComponent(randomImage.path)}`;

    // Format description with clickable links
    // Basic URL validation for source (simple check for http/https)
    const isValidUrl = (url: string) => /^https?:\/\/.+/.test(url);
    const sourceUrl = randomImage.source && isValidUrl(randomImage.source) ? randomImage.source : null;

    let sourceLinks = '';
    if (sourceUrl && wallhavenUrl) {
      // Both available: Show both links
      sourceLinks = `Source: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Original</a> | <a href="${wallhavenUrl}" target="_blank" rel="noopener noreferrer">Wallhaven</a>`;
    } else if (sourceUrl) {
      // Only source: Show source link
      sourceLinks = `Source: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Original</a>`;
    } else {
      // Fallback to Wallhaven
      sourceLinks = `Source: <a href="${wallhavenUrl}" target="_blank" rel="noopener noreferrer">Wallhaven</a>`;
    }

    const itemData = {
      name: "Wallhaven Wallpaper",
      rarity: 1,
      imageURL: proxiedImageUrl, // Full image URL
      description: `Wallpaper from Wallhaven.cc. ${sourceLinks}. Tags: ${randomImage.tags?.map((t: WallhavenTag) => t.name).join(', ') || 'None'}.`,  // Includes clickable links
    };

    // Save to DB
    const existingItem = await prisma.item.findFirst({  // Changed from 'let' to 'const'
      where: { imageURL: randomImage.path },  // Note: Using original path for uniqueness check
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

  } catch (error: unknown) {  // Changed from 'any' to 'unknown'
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