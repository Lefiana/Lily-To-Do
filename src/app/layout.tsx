// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"; 
import "./globals.css";

// 🎯 Import the RootLayoutWrapper (Server Component)
import RootLayoutWrapper from "@/components/RootLayoutWrapper"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lily",
  description: "A todo app and Gacha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ Wrap all pages in the SessionProvider */}
        <SessionProvider>
            {/* 🎯 Wrap the content in the Server Component that fetches the theme. */}
            <RootLayoutWrapper>
                {children}
            </RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}