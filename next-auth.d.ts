import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    id?: string; // Add `id` to the session interface
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // Add `id` to the JWT interface
  }
}
