import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";

export const providers = [
	Google({
		clientId: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
	}),
];

const { handlers, signIn, signOut, auth } = NextAuth({
	providers: providers,
	pages: {
		signIn: "/login",
	},
});

export { signIn, signOut, auth };
export { handlers as GET, handlers as POST };
