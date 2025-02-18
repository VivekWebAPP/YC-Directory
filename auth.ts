import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";
import GitHubProvider from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const githubId = profile?.id || account?.providerAccountId;
      const login = profile?.login;

      if (!githubId || !login) {
        return false;
      }

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: githubId });

      if (!existingUser) {
        await writeClient.withConfig({ useCdn: false }).create({
          _type: "author",
          id: githubId,
          name: user.name,
          username: login,
          email: user.email,
          image: user.image,
          bio: profile?.bio || "",
        });
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });

        if (user) {
          token.id = user._id; // Assign the user's `_id` to `token.id`
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.id = token.id; // Pass `id` to the session
      }
      return session;
    },
  },
});
