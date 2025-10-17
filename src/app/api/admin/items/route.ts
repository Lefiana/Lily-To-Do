import { NextRequest, NextResponse } from "next/server";
import { getRequiredAuth } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { extractDominantColors } from "@/services/color-extractor";
// Define the required role for this protected route. 
// MUST match the casing in your Prisma Enum: Role.ADMIN
const ADMIN_ROLE = 'ADMIN'; 

/**
 * GET /api/admin/items
 * Fetch all items (Admin access only).
 */
export async function GET(req: NextRequest) {
    try {
        // Enforce Admin role check. If it fails, it throws a NextResponse (401/403)
        await getRequiredAuth(ADMIN_ROLE);
        
        // --- ONLY ADMINS REACH THIS POINT ---

        // Fetch all items
        const items = await prisma.item.findMany({
             orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(items, { status: 200 });

    } catch (error) {
        // If 'error' is a NextResponse (thrown by getRequiredAuth), return it directly.
        if (error instanceof NextResponse) {
            return error;
        }
        
        // Handle other internal errors (e.g., database failure)
        console.error("Error fetching admin items:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

/**
 * POST /api/admin/items
 * Create a new Gacha/Theme item (Admin access only).
 */
export async function POST(req: NextRequest) {
    try {
        // Enforce Admin role check.
        await getRequiredAuth(ADMIN_ROLE);
        
        // --- ONLY ADMINS REACH THIS POINT ---

        const body = await req.json();
        // Item fields relevant to Gacha/Themes
        const { name, rarity, description, imageURL } = body; 

        // Rarity is required and must be a positive number for Gacha logic
        if (!name || typeof rarity !== 'number' || rarity < 1) {
            return NextResponse.json(
                { error: "Missing required fields or invalid types (name: string, rarity: number >= 1)" },
                { status: 400 }
            );
        }

        let color1: string | null = null;
        let color2: string | null = null;

        if (imageURL && typeof imageURL === 'string') {
            try{
                const colors = await extractDominantColors(imageURL);
                color1 = colors.color1;
                color2 = colors.color2;
            }catch(err){
                console.error("Color extraction failed for new item URL. Colors will be null or defaults from service.", err);
        }
    }
        // Create the new item in the database
        const newItem = await prisma.item.create({
            data: { 
                name, 
                rarity, 
                description: description || null, // Allow description to be optional
                imageURL: imageURL || null,       // Allow imageURL to be optional
                color1,
                color2,
            }
        });

        return NextResponse.json(newItem, { status: 201 });

    } catch (error) {
        // If 'error' is a NextResponse (thrown by getRequiredAuth), return it directly.
        if (error instanceof NextResponse) {
            return error;
        }

        // Handle JSON parsing errors or Prisma database errors
        console.error("Error creating admin item:", error);
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
