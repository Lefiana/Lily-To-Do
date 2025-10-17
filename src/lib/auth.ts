import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client"; 
import NextAuth from "next-auth";

// This is the complete, valid configuration object.
export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    
    // 🎯 CRITICAL: This array must ONLY contain called provider functions.
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) { 
                // 🎯 NEW LOG: Check if authorize function is executed
                console.log("[AUTH DEBUG] authorize function started.");

                if (!credentials?.email || typeof credentials.email !== 'string' || 
                  !credentials?.password || typeof credentials.password !=='string') 
                {
                    throw new Error("Email and password are required.");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                // --- DEBUGGING LOGS ACTIVE ---
                if (!user) {
                    console.log(`[AUTH DEBUG] User not found for email: ${credentials.email}`);
                    throw new Error("Invalid email or password.");
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                console.log(`[AUTH DEBUG] Password compare result for ${user.email}: ${passwordMatch}`);

                if (!passwordMatch) {
                    throw new Error("Invalid email or password.");
                }
                console.log(`[AUTH DEBUG] SUCCESSFULLY authorized user: ${user.email}. Preparing to return user object.`);
                // --- DEBUGGING LOGS ACTIVE ---

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    
    pages: {
        signIn: "/login",
        error: "/api/auth/error", 
    },
    
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role; 
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id && typeof token.id === 'string') {
              session.user.id = token.id;}
            
            if (token?.role) {
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
};

export const { handlers, auth } = NextAuth(authOptions);
