import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/session";

export async function GET(req: NextRequest){
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try{
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
    }catch(error){
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
    }
}