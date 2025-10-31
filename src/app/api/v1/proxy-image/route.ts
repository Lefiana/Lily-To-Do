import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGIN = 'https://w.wallhaven.cc/';
const FETCH_TIMEOUT_MS = 30000; // Increased to 30 seconds for large images
const MAX_RETRIES = 5; // Increased retries

async function fetchWithTimeout(url: string, options: RequestInit, timeout = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);
      if (response.ok) return response;
      console.warn(`Attempt ${attempt}: Fetch failed with status ${response.status} for ${url}`);
    } catch (err: unknown) {  // Changed from 'any' to 'unknown' for type safety
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn(`Attempt ${attempt}: Timeout fetching ${url}`);
      } else if (err instanceof Error) {
        console.warn(`Attempt ${attempt}: ${err.message}`);
      } else {
        console.warn(`Attempt ${attempt}: Unknown error occurred`);
      }
    }
  }
  throw new Error(`All ${retries} attempts failed for ${url}`);
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  if (!imageUrl.startsWith(ALLOWED_ORIGIN)) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const response = await fetchWithRetry(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://wallhaven.cc/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'DNT': '1',
      },
    });

    const contentType = response.headers.get('Content-Type') || '';
    if (!contentType.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    // Check if body exists (rare, but defensive)
    if (!response.body) {
      throw new Error('Response body is null or empty');
    }

    // Stream the response instead of buffering
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: unknown) {  // Changed from 'any' to 'unknown' for type safety
    // Safely check if the error is an instance of Error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Proxy error:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch image', details: errorMessage }, { status: 502 });
  }
}
