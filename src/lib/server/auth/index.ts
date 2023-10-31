import { env } from '$env/dynamic/private';
import GitHub from '@auth/core/providers/github';
import type { SvelteKitAuthConfig } from '@auth/sveltekit';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { DrizzleAdapter } from './drizzle-adapter';

export const authOptions = {
	adapter: DrizzleAdapter(db),
	secret: env.AUTH_SECRET,
	providers: [
		GitHub({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET
		})
		/**
		 * Todo: add support for google and email provider
		 */
	],
	callbacks: {
		async signIn({ user }) {
			/**
			 * don't let banned users to login
			 * hold users can login but can't do much actions
			 */
			if (!user.email || user.status === 'banned') return false;

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
			if (trigger === 'update') {
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
		strategy: 'jwt'
	},
	trustHost: true
	// pages: {
	// 	signIn: '/login',
	// 	signOut: '/',
	// 	error: '/login',
	// 	verifyRequest: '/login'
	// }
} satisfies SvelteKitAuthConfig;
