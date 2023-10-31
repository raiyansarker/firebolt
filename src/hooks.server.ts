import { authOptions } from '$lib/server/auth';
import { SvelteKitAuth } from '@auth/sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle = SvelteKitAuth(authOptions) satisfies Handle;
