import { env } from "$env/dynamic/private";
import GitHubProvider from "@auth/core/providers/github";
import GoogleProvider from "@auth/core/providers/google";
import type { SvelteKitAuthConfig } from "@auth/sveltekit";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { DrizzleAdapter } from "./drizzle-adapter";
import { nanoid } from "nanoid";
import { production } from "$lib/utils";
import { sendMail } from "$lib/utils/email.server";

export const authOptions = {
	adapter: DrizzleAdapter(db),
	secret: env.AUTH_SECRET,
	providers: [
		GitHubProvider({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET
		}),
		GoogleProvider({
			clientId: env.GOOGLE_ID,
			clientSecret: env.GOOGLE_SECRET
		}),
		{
			id: "email",
			type: "email",
			name: "Email",
			/**
			 * These are required until they fix the type error
			 *
			 * https://github.com/nextauthjs/next-auth/issues/8125
			 */
			from: "notarealemail@definitelynotreal.com",
			server: {},
			maxAge: 24 * 60 * 60,
			options: {},
			async generateVerificationToken() {
				return nanoid();
			},
			async sendVerificationRequest({ identifier: email, url }) {
				if (!production) return console.log(`Login Link: ${url}`);

				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const [_, sendMailError] = await sendMail({
					to: {
						email: email
					},
					subject: "Verify your email address",
					/**
					 * This is temporary
					 */
					body: {
						text: `
							Please verify your email address by clicking the link below:
							${url}
						`,
						html: `
							<p>Please verify your email address by clicking the link below:</p>
							<a href="${url}">${url}</a>
						`
					}
				});

				if (sendMailError) {
					console.error(sendMailError);
					throw new Error("Unable to send email");
				}
			}
		}
	],
	callbacks: {
		async signIn({ user }) {
			/**
			 * don't let banned users to login
			 * hold users can login but can't do much actions
			 */
			if (!user) return true; // user object is null if user is not found on the first signin
			if (!user.email || user.status === "banned") return false;

			return true;
		},
		async jwt({ token, user, trigger }) {
			/**
			 * Todo: add support for force logout
			 */

			if (user) {
				token.user = {
					id: user.id,
					email: user.email,
					image: user.image,
					name: user.name,
					status: user.status
				};
			}

			/**
			 * Refresh user data if they update their profile
			 */
			if (trigger === "update") {
				const refreshedUser = await db.query.users.findFirst({
					where: eq(users.id, token.sub!)
				});

				if (refreshedUser) {
					token.user = {
						id: refreshedUser.id,
						email: refreshedUser.email,
						image: refreshedUser.image,
						name: refreshedUser.name,
						status: refreshedUser.status
					};
				}
			}

			return token;
		},
		async session({ session, token }) {
			session.user = token.user;

			return session;
		}
	},
	session: {
		strategy: "jwt"
	},
	trustHost: true,
	pages: {
		signIn: "/login",
		signOut: "/",
		error: "/login",
		verifyRequest: "/login"
	}
} satisfies SvelteKitAuthConfig;
