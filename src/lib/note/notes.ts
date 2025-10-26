// note post/patch/delete/get
import { prisma } from "@/lib/prisma";
import { NoteData } from "@/types/note";

export async function createNote (data: NoteData, userId: string) {
    try{
        return await prisma.notes.create({
            data: {
                ...data,
                userId,
            },
        });
    }catch (error) {
        console.error("Error in createNote:", error);
        throw new Error("Failed to create note");
    }
}

   export async function updateNote(noteId: string, data: Partial<NoteData>, userId: string) {
     try {
       const { title, content, tags, isFavorite } = data;
       const updateData: Partial<NoteData> = {};
       if (title !== undefined) updateData.title = title;
       if (content !== undefined) updateData.content = content;
       if (tags !== undefined) updateData.tags = tags;
       if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
       if (Object.keys(updateData).length === 0) {
         throw new Error("No fields provided for update");
       }
       const updatedNote = await prisma.notes.update({
         where: {
           id: noteId,
           userId: userId,
         },
         data: updateData,
       });
         return updatedNote;
        } catch (error) {
         console.error("Error in updateNote:", error);
            throw new Error("Failed to update note");
        }
    }

export async function deleteNote (noteId: string, userId: string) {
    try{
        return await prisma.notes.delete({
            where: {
                id: noteId,
                userId: userId,
            },
        });
    }catch (error) {
        console.error("Error in deleteNote:", error);
        throw new Error("Failed to delete note");
    }
}

export async function getNoteById (noteId: string, userId: string) { 
    try{
        return await prisma.notes.findUnique({
            where: {
                id: noteId,
                userId: userId,
            },
            select: {
                id: true,
                title: true,
                content: true,
                tags: true,
                createdAt: true,
            }
        });
    }
    catch (error) {
        console.error("Error in getNotesByUser:", error);
        throw new Error("Failed to get notes"); 
    }
}

export async function getNotesByUser(userId: string, isFavorite: boolean) {
  try {
    return await prisma.notes.findMany({
      where: { userId, ...(isFavorite && { isFavorite: true }) },
      orderBy: { createdAt: 'desc' }, // optional but recommended
    });
  } catch (error) {
    console.error("Error in getNotesByUser:", error);
    throw new Error("Failed to get notes");
  }
}