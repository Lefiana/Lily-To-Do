// api/v1/note/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/session";
import { createNote, getNotesByUser} from "@/lib/note/notes";


export async function POST(req: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try{
        const body = await req.json();
        const newNote = await createNote(body, userId);
        return NextResponse.json(newNote, { status: 201 });
    }catch(err){
    console.error("Error creating note:", err);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }
}

export async function GET (req: NextRequest){
    const { searchParams } = new URL(req.url);
    const userId = await getUserIdFromSession();
    const isFavorite = searchParams.get("favorite") === "true";
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try{
        const notes = await getNotesByUser(userId, isFavorite);
        return NextResponse.json(notes, { status: 200 });

    }catch(err){
        console.error("Error fetching notes:", err);
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }
}
