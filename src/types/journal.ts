import { DateTime } from "next-auth/providers/kakao";

export interface JournalData {
    title: string;
    date: DateTime,
    createdAt: DateTime,
    content: string;
    mood: string;
    tags?: string[];
}