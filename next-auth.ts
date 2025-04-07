import NextAuth, { User, Account } from "next-auth";
import Google from "next-auth/providers/google";
import sql from "@/utils/database";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export const authOption = {
	secret: process.env.NEXTAUTH_SECRET!,
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	pages: {
		signIn: "/dangnhap",
	},
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
						secure: process.env.NODE_ENV === "production",
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
			// Allow relative URLs
			if (url.startsWith("/")) {
				return `${baseUrl}${url}`;
			}
			// Allow URLs from the same origin
			else if (new URL(url).origin === baseUrl) {
				return url;
			}
			// Allow localhost in development
			else if (
				process.env.NODE_ENV === "development" &&
				url.startsWith("http://localhost:")
			) {
				return url;
			}
			return baseUrl;
		},
	},
};

export const { auth, signIn, signOut } = NextAuth(authOption);
