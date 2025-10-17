// src/types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"; // 1. Must import JWT
import { Role } from "@prisma/client"; // 2. Must import Role from your Prisma client

declare module "@auth/core/adapters"{
  interface AdapterUser{
    role: Role;
  }
}

declare module "next-auth/core/types"{
  interface User{
    role: Role;
  }
}

// 1. Augment the NextAuth "next-auth" Module
declare module "next-auth" {
  
  // Augment the User interface (The object passed on initial sign-in)
  interface User {
    id: string;
    role: Role; // ✅ ADDED TYPE
  }

  // Augment the Session interface (Used throughout the client and server)
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string | null;
      name?: string | null;
      image?: string | null;
      role: Role; 
    } & DefaultSession["user"];
  }
}

// 2. Augment the "next-auth/jwt" Module
declare module "next-auth/jwt" {
  // Augment the JWT token payload
  interface JWT {
    id: string;
    // ✅ ADDED TYPE: The token carries the role between requests
    role: Role; 
  }
}