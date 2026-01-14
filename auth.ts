import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/src/auth/config";
import { findDataUserByEmail } from "./lib/findData";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
    session: {
    strategy: "jwt", 
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt: ({ user, token, trigger, session }) => {
      if (user) {
        token.role = user.role;
        token.address = user.address;
        token.phone = Number(user.phone);
        token.imageUrl = user.imageUrl;
      }
      
      if (trigger === "update" && session?.user) {
        token.role = session.user.role;
        token.address = session.user.address;
        token.phone = Number(session.user.phone);
        token.name = session.user.name;
        token.imageUrl = session.user.imageUrl;
      }
      
      return token;
    },
    session: ({ session, token }) => {
      session.user.role = token.role;
      session.user.id = token.sub;
      session.user.address = token.address;
      session.user.phone = Number(token.phone);
      session.user.imageUrl = token.imageUrl;
      return session;
    },
    async signIn({ user }) {
      const allowedEmails = await findDataUserByEmail(user.email ?? "");

      const emails = [process.env.EMAIL_ADMIN, allowedEmails?.email].filter(
        Boolean
      );
      if (!emails.includes(user.email!)) {
        return false;
      }
      return true;
    },
  },
 
});
