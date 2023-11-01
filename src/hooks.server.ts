import { authHandler } from '$lib/server/hooks/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(authHandler) satisfies Handle;
