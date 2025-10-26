// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"; 
import "./globals.css";

// 🎯 Import RootLayoutWrapper
import RootLayoutWrapper from "@/components/RootLayoutWrapper"; 
import { Toaster } from "react-hot-toast"; // ✅ Add this

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
        <SessionProvider>
          <RootLayoutWrapper>
            {children}
            {/* ✅ Global toast notification container */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgba(30, 30, 30, 0.85)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                },
              }}
            />
          </RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
