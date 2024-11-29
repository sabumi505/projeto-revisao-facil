import { nextAuthOptions } from "@digifarm/lib/auth/options";
import NextAuth from "next-auth/next";

// @ts-ignore
const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
