import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      return true; // Allow sign in, handle backend logic in jwt
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/guests/google-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                fullName: user.name,
                // Add validation/extra fields if present in user/profile
                // nationality, nationalID could be added later via update profile
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to login to backend");
          }

          const data = await response.json();
          // Backend returns { statusCode, data: { guest, accessToken, refreshToken }, message, success }
          const { guest, accessToken, refreshToken } = data.data;

          token.accessToken = accessToken;
          token.refreshToken = refreshToken;
          token.guestId = guest._id;
        } catch (error) {
          console.error("Backend login error:", error);
          // In a real app, you might want to reject the sign in here
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.guestId = token.guestId;
      session.accessToken = token.accessToken;
      // We don't necessarily need to expose refreshToken to the client, keeping it on the server (in the JWT) is safer
      // But for now, let's keep it simple. If we need rotation, we do it in jwt callback.
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
