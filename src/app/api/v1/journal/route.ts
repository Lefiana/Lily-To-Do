// api/v1/note/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/session";
import { createJournal, getJournalByUser } from "@/lib/journal/journal";


export async function POST(req: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try{
        const body = await req.json();
        const newNote = await createJournal(body, userId);
        return NextResponse.json(newNote, { status: 201 });
    }catch(err){
    console.error("Error creating note:", err);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }
}

export async function GET (_req: NextRequest){
    const userId = await getUserIdFromSession();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try{
        const journal = await getJournalByUser(userId);
        return NextResponse.json(journal, { status: 200 });

    }catch(err){
        console.error("Error fetching journal:", err);
        return NextResponse.json({ error: "Failed to fetch journal" }, { status: 500 });
    }
}
