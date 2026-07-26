import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { login } from "@/modules/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const res = await login({ email, password });
          if (res.error) {
            if (res.statusCode === 401) {
              return null;
            }
            throw new Error(res.message);
          }

          return {
            ...res.data.user,
            roleId: res.data.user.roleId,
            modules: res.data.user.modules,
            token: res.data.token,
          };
        }

        return null;
      },
    }),
  ],
});
