// api/admin/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRequiredAuth } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { extractDominantColors } from "@/services/color-extractor";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; // Import for error handling

// Define the required role for this protected route
const ADMIN_ROLE = 'ADMIN'; 

// Define the structure for dynamic route parameters
interface Context {
    params: Promise<{ id: string }>;
}

/**
 * Helper function to find the item by ID.
 * Used internally by GET, PATCH, and DELETE to simplify error handling.
 */
async function findItemOrThrow(id: string) {
    const item = await prisma.item.findUnique({
        where: { id },
    });

    if (!item) {
        throw NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return item;
}

// ------------------------------------------------------------------------------------------------

/**
 * GET /api/admin/items/[id]
 * Fetch a single item by ID (Admin access only).
 */
export async function GET(req: NextRequest, props: Context) {
    const params = await props.params;
    try {
        await getRequiredAuth(ADMIN_ROLE);
        const item = await findItemOrThrow(params.id);
        
        return NextResponse.json(item, { status: 200 });

    } catch (error) {
        if (error instanceof NextResponse) {
            return error;
        }
        console.error("Error fetching item:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

// ------------------------------------------------------------------------------------------------

/**
 * PATCH /api/admin/items/[id]
 * Update a single item by ID (Admin access only).
 * Handles partial updates (e.g., changing only the rarity).
 */
export async function PATCH(req: NextRequest, props: Context) {
    const params = await props.params;
    try {
        await getRequiredAuth(ADMIN_ROLE);
        const { id } = params;

        // Ensure the item exists before attempting to update
        await findItemOrThrow(id);

        const body = await req.json();
        
        // Prepare data object, only including keys present in the request body
        const updateData: {
            name?: string;
            rarity?: number;
            description?: string | null;
            imageURL?: string | null;
            color1?: string | null;
            color2?: string | null;
        } = {};

        if (body.name !== undefined) updateData.name = body.name;
        if (body.rarity !== undefined) updateData.rarity = body.rarity;
        
        // Use hasOwnProperty to allow setting optional fields to null (clearing them)
        if (Object.prototype.hasOwnProperty.call(body, 'description')) {
            // Convert empty string to null if needed, otherwise use the provided string
            updateData.description = body.description || null; 
        }
        if (Object.prototype.hasOwnProperty.call(body, 'imageURL')) {
            const newImageURL = body.imageURL || null;
            updateData.imageURL = body.imageURL || null;

            if (newImageURL) {
                try{
                    const colors = await extractDominantColors(newImageURL);
                    updateData.color1 = colors.color1;
                    updateData.color2 = colors.color2;
                }catch(error){
                    console.error("Color extraction failed during item update:", error);
                    // Optionally, you could choose to set default colors or leave them unchanged
                    updateData.color1 = '#57025a'; // Fallback color
                    updateData.color2 = '#ec4899'; // Fallback color
                }
            }else{
                updateData.color1 = null;
                updateData.color2 = null;
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No fields provided for update" }, { status: 400 });
        }
        
        // Update the item
        const updatedItem = await prisma.item.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedItem, { status: 200 });

    } catch (error) {
        if (error instanceof NextResponse) {
            return error;
        }
        console.error("Error updating item:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/items/[id]
 * Delete a single item by ID (Admin access only).
 * Handles cascading delete of related Gacha records to avoid foreign key constraints.
 */
export async function DELETE(req: NextRequest, props: Context) {
    const params = await props.params;
    try {
        await getRequiredAuth(ADMIN_ROLE);
        const { id } = params;

        // Ensure the item exists before attempting to delete
        await findItemOrThrow(id);

        // First, delete all related Gacha records to avoid foreign key constraint
        await prisma.gacha.deleteMany({
            where: { itemId: id },
        });

        // Now delete the item (safe since related records are gone)
        await prisma.item.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });

    } catch (error) {
        if (error instanceof NextResponse) {
            return error;
        }
        // Handle specific Prisma errors
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                // This shouldn't happen now, but just in case
                return NextResponse.json({ error: "Cannot delete item because it is referenced by other records (e.g., in Gacha)." }, { status: 409 });
            }
            // Handle other known Prisma errors if needed
            console.error("Prisma error deleting item:", error);
            return NextResponse.json({ error: "Database error occurred while deleting item." }, { status: 500 });
        }
        console.error("Error deleting item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}