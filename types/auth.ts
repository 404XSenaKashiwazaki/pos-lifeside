import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role?: string | null;
    address?: string | null;
    phone?: number | null;
    imageUrl?: string | null;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    address?: string | null;
    phone?: number | null;
    sub: string;
    imageUrl?: string | null;
  }
}
