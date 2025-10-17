// src/components/RootLayoutWrapper.tsx (Server Component)
import { auth } from "@/lib/auth"; // Your Auth.js/NextAuth helper
import { prisma } from "@/lib/prisma";
import { ThemedBackgroundLayout } from "./ThemedBackgroundLayout";
// Import the color extraction service if the Item model doesn't store colors

export default async function RootLayoutWrapper({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    const session = await auth();

        let themeData:{
            backgroundUrl: string | undefined | null;
            color1: string | undefined | null;
            color2: string | undefined | null;
        } = {
            backgroundUrl: undefined,
            color1: undefined,
            color2: undefined,
        };

    if (session?.user.id) {
        // Fetch the user and their active theme item
        const userWithTheme = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                activeThemeItem: {
                    select: {
                        imageURL: true,
                        // Assuming you added color properties to the Item model for caching
                        color1: true,
                        color2: true, 
                    }
                }
            }
        });

        if (userWithTheme?.activeThemeItem?.imageURL) {
            themeData.backgroundUrl = userWithTheme.activeThemeItem.imageURL;
            themeData.color1 = userWithTheme.activeThemeItem.color1; // <-- Assign data
            themeData.color2 = userWithTheme.activeThemeItem.color2; // <-- Assign data
            // 🎯 NOTE: If you don't store color1/color2 on the Item model, 
            // you MUST call extractDominantColors(themeData.backgroundUrl) here.
            // It's better to store the extracted colors on the Item model after admin creation.
        }
    }

    return (
        <ThemedBackgroundLayout 
            backgroundUrl={themeData.backgroundUrl || undefined}
            color1={themeData.color1 || undefined} 
            color2={themeData.color2 || undefined}
        >
            {children}
        </ThemedBackgroundLayout>
    );
}