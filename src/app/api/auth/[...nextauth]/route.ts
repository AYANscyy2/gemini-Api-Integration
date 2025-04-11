// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/server/auth/config";

// Create a handler directly in this file
const handler = NextAuth(authOptions);

// Export the handler functions
export { handler as GET, handler as POST };
