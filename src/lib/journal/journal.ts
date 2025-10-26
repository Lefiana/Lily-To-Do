// journal post/patch/delete/get
import { prisma } from "@/lib/prisma";
import { JournalData } from "@/types/journal";


export async function createJournal (data: JournalData, userId: string) {
    try{
        return await prisma.journal.create({
            data: {
                ...data,
                userId,
            },
        });
    }catch (error) {
        console.error("Error in createJournal:", error);
        throw new Error("Failed to create Journal");
    }
}

export async function updateJournal(journalId: string, data: JournalData, userId: string) {
    try{

        const { title, content, mood, tags } = data;
        const updateData: Partial<JournalData> = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (mood) updateData.mood = mood;
        if (tags) updateData.tags = tags;

        if (Object.keys(updateData).length === 0){
            throw new Error (" No fields provded for update")
        }

        const updatedJournal = await prisma.journal.update({
            where: {
                id: journalId,
                userId: userId,
            },
            data: 
                updateData,
        });

        return updatedJournal;
    }catch (error) {
        console.error("Error in updateJournal:", error);
        throw new Error("Failed to update journal");
    }
}

export async function deleteJournal (journalId: string, userId: string) {
    try{
        return await prisma.journal.delete({
            where: {
                id: journalId,
                userId: userId,
            },
        });
    }catch (error) {
        console.error("Error in deleteJournal:", error);
        throw new Error("Failed to delete journal");
    }
}

export async function getJournalById (journalId: string, userId: string) { 
    try{
        return await prisma.journal.findUnique({
            where: {
                id: journalId,
                userId: userId,
            },
            select: {
                id: true,
                title: true,
                content: true,
                mood: true,
                tags: true,
                createdAt: true,
            }
        });
    }
    catch (error) {
        console.error("Error in getJournalById:", error);
        throw new Error("Failed to get journals"); 
    }
}

export async function getJournalByUser(userId: string) {
  try {
    return await prisma.journal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, 
    });
  } catch (error) {
    console.error("Error in getJournalByUser:", error);
    throw new Error("Failed to get journals");
  }
}