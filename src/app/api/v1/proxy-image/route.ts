// app/api/v1/proxy-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Validate the URL to ensure it's from Wallhaven (security)
  if (!imageUrl.startsWith('https://w.wallhaven.cc/')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // Fetch the image from Wallhaven
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Lily/1.0', // Optional: Spoof a user-agent to avoid blocks
        'Referer': 'https://wallhaven.cc/', // Spoof referrer to mimic a direct visit
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    // Get the image as a blob
    const imageBlob = await response.blob();

    // Return the image with CORS headers
    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Access-Control-Allow-Origin': '*', // Allow all origins (or specify your domain)
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Optional: Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}