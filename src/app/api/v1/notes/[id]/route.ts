// api/v1/note/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/session";
import { deleteNote, updateNote, getNoteById, } from "@/lib/note/notes";

//patch
   export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
     const userId = await getUserIdFromSession();
     if (!userId) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
     const noteId = (await context.params).id;
     try {
       const body = await req.json();
       const { title, content, tags, isFavorite } = body;
       // Validate isFavorite if provided
       if (isFavorite !== undefined && typeof isFavorite !== 'boolean') {
         return NextResponse.json({ error: "isFavorite must be a boolean" }, { status: 400 });
       }
       const updatedNote = await updateNote(noteId, { title, content, tags, isFavorite }, userId);
       return NextResponse.json(updatedNote, { status: 200 });
     } catch (err) {
       console.error("Error updating note:", err);
       return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
     }
   }

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }){
    const params = await context.params;
    const userId = await getUserIdFromSession();

    if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = params.id;

    try{
        await deleteNote(noteId, userId)
        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
    }catch(err){
        console.error("Error Deleting note:", err);
        return NextResponse.json({ error: "Failed to Deketing note"}, { status : 500})
    }

}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }){
    const userId = await getUserIdFromSession();
    if (!userId) {
        // Return 401 even though middleware should catch it, for safety.
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
        const noteId = (await context.params).id;
        try{
        const note = await getNoteById(userId, noteId);
        if (!note) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }
        return NextResponse.json(note, { status: 200 });
    }catch(err){
        console.error("Error fetching note:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}