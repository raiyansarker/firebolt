// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { DefaultJWT, DefaultSession } from '@auth/core/types';
import type { UsersModel } from '$lib/db/models';
import type { User } from '@auth/core/types';
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			cf?: IncomingRequestCfProperties;
		}
	}
}

declare module '@auth/core/types' {
	export interface User extends Pick<UsersModel, 'id' | 'name' | 'email' | 'image' | 'status'> {}

	export interface Session extends DefaultSession {
		user: User;
	}
}

declare module '@auth/core/jwt' {
	export interface JWT extends DefaultJWT {
		user: User;
	}
}

export {};
