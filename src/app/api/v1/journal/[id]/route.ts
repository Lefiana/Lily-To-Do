// api/v1/journal/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/session";
import { deleteJournal, updateJournal, getJournalById } from "@/lib/journal/journal";

//patch
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }){
    const userId = await getUserIdFromSession();

    if (!userId) {
        // Return 401 even though middleware should catch it, for safety.
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const journalId = (await context.params).id;

    try{
        const body = await req.json();
        const updatedJournal = await updateJournal(journalId, body, userId);
        return NextResponse.json(updatedJournal, { status: 200 });
    }catch(err){
        console.error("Error updating journal:", err);
        return NextResponse.json({ error: "Failed to Update journal"}, { status : 500})
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }){
    const params = await context.params;
    const userId = await getUserIdFromSession();

    if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const journalId = params.id;

    try{
        await deleteJournal(journalId, userId)
        return NextResponse.json({ message: "Journal deleted successfully" }, { status: 200 });
    }catch(err){
        console.error("Error Deleting journal:", err);
        return NextResponse.json({ error: "Failed to Deketing journal"}, { status : 500})
    }

}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }){
    const userId = await getUserIdFromSession();
    if (!userId) {
        // Return 401 even though middleware should catch it, for safety.
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
        const journalId = (await context.params).id;
        try{
        const journal = await getJournalById(userId, journalId);
        if (!journal) {
        return NextResponse.json({ error: "Journal not found" }, { status: 404 });
        }
        return NextResponse.json(journal, { status: 200 });
    }catch(err){
        console.error("Error fetching journal:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}