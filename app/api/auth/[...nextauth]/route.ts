import NextAuth, { User, Account } from "next-auth";
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
		async signIn({ user, account }: { user: User; account: Account | null }) {
			if (account?.provider === "google" && account?.access_token) {
				try {
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
					cookieStore.set("session", username, {
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
		async redirect() {
			return process.env.NEXTAUTH_URL!;
		},
	},
};

export const { auth, signIn, signOut } = NextAuth(authOption);
const handler = NextAuth(authOption);
export const GET = handler;
export const POST = handler;
