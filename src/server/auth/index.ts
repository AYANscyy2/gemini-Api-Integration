// server/auth/index.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export const getSession = () => getServerSession(authOptions);

// Only if you need client-side auth helpers
export { authOptions };
