import { authHandler } from '$lib/server/hooks/auth';
import { reqLogger as logger } from '$lib/server/hooks/log';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(logger, authHandler) satisfies Handle;
