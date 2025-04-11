// 1. First, update your NextAuth configuration to include credentials provider
// server/auth/config.ts
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs"; // You'll need to install this: npm install bcryptjs
import { getUserByEmail } from "@/app/action";
// import { getUserByEmail } from "@/lib/db"; // Create this function to fetch user from your database

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const user = await getUserByEmail(credentials.email);

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id
        }
      };
    }
  },
  pages: {
    signIn: "/login",
    error: "/login" // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt"
  }
};
