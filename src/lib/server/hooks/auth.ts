import { SvelteKitAuth } from '@auth/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { authOptions } from '$lib/server/auth';

const authHandler: Handle = SvelteKitAuth(authOptions);

export { authHandler };
