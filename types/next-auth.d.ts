import NextAuth, { DefaultSession } from "next-auth";
import { BackendUser } from "../src/auth.config";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: BackendUser & DefaultSession["user"] & { permissions?: string[] };
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends BackendUser {}
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user?: BackendUser;
    backendExp?: number;
  }
}
