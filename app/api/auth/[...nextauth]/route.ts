import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import sql from "@/utils/database";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
// import Credentials from "next-auth/providers/credentials";

export const authOption = {
	secret: process.env.NEXTAUTH_SECRET!,
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async signIn({
			user,
			account,
			profile,
		}: {
			user: any;
			account: any;
			profile?: any;
		}) {
			if (account.provider === "google" && account.access_token) {
				try {
					// Register new user directly since we already checked existence
					const username = user.name?.replace(/\s+/g, "").toLowerCase() || "";
					const randomPassword = Math.random().toString(36).slice(-8);
					const hashedPassword = await bcrypt.hash(randomPassword, 10);

					await sql`
						INSERT INTO "User Infomation"."Infomation" 
						("Name", "Username", "Password", "Email") 
						VALUES (${user.email}, ${username}, ${hashedPassword}, ${user.email})
					`;

					// Set session cookie directly using cookies API
					const cookieStore = await cookies();
					cookieStore.set("session", user.email, {
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						maxAge: 30 * 24 * 60 * 60, // 30 days
					});

					return true;
				} catch (error) {
					console.error("Database error:", error);
					return false;
				}
			}
			return false;
		},
		async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
			return "http://localhost:3000";
		},
	},
};

export const { auth, signIn, signOut } = NextAuth(authOption);
const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
