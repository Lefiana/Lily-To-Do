// /src/types/note.ts
import { DateTime } from "next-auth/providers/kakao";

export interface NoteData {
    title: string;
    content: string;
    tags?: string[];
    createdAt: DateTime
    isFavorite: boolean;
}