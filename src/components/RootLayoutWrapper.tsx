// src/components/RootLayoutWrapper.tsx
"use client"; // 🎯 Make it client-side for dynamic fetching

import { useSession } from "next-auth/react";
import useSWR from 'swr';
import { useEffect } from "react";
import { ThemedBackgroundLayout } from "./ThemedBackgroundLayout";

const fetcher = (url: string) => 
  fetch(url, { credentials: "include" }).then(res => res.json());

export default function RootLayoutWrapper({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    const { data: session } = useSession();

    // 🎯 Fetch theme dynamically when session changes
    const { data: themeData, isLoading } = useSWR(
        session?.user.id ? `/api/v1/user/theme?userId=${session.user.id}` : null,
        fetcher,{
            revalidateOnFocus: false,
            dedupingInterval: 2000,
            refreshInterval: 0,
        }
    );

    useEffect(() => {
        if (themeData?.backgroundUrl) {
            const img = new Image();
            img.src = themeData.backgroundUrl;
        }
    }, [themeData?.backgroundUrl]);

    if (isLoading){
        return <div className="flex items-center justify-center min-h-screen text-white">Loading theme...</div>;
    }
    return (
        <ThemedBackgroundLayout 
            backgroundUrl={themeData?.backgroundUrl}
            color1={themeData?.color1} 
            color2={themeData?.color2}
        >
            {children}
        </ThemedBackgroundLayout>
    );
}
