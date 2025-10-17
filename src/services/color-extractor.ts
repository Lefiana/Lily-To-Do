// src/services/color-extractor.ts
const Vibrant = require('node-vibrant');

/**
 * Extracts dominant colors from an image URL.
 * @param imageUrl - The URL of the image (e.g., from Cloudinary).
 * @returns An object with two dominant colors in hex format.
 */
export async function extractDominantColors(imageUrl: string): Promise<{ color1: string; color2: string }> {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();

    // Vibrant returns a palette of colors (Vibrant, DarkVibrant, LightVibrant, Muted, etc.)
    // We'll prioritize the 'Vibrant' color for color1 and 'DarkMuted' for color2.
    // If a swatch is missing, we fall back to a default color.

    const color1 = palette.Vibrant?.hex || palette.Muted?.hex || '#57025a';
    const color2 = palette.DarkMuted?.hex || palette.DarkVibrant?.hex || '#ec4899';

    return { color1, color2 };
  } catch (error) {
    console.error("Failed to extract colors from image:", error);
    // Return reliable fallbacks on failure
    return { color1: '#57025a', color2: '#ec4899' };
  }
}