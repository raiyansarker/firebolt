import { env } from '$env/dynamic/private';
import { Axiom } from '@axiomhq/js';
import type { Handle } from '@sveltejs/kit';

function getHeaderMap(headers: Headers, allowlist: string[]) {
	if (!allowlist.length) {
		return {};
	}

	return [...headers].reduce((acc, [headerKey, headerValue]) => {
		if (allowlist.includes(headerKey)) {
			// @ts-expect-error - Move on
			acc[headerKey] = headerValue;
		}

		return acc;
	}, {});
}

const reqLogger: Handle = async ({ event, resolve }) => {
	/**
	 * Send logs only in production
	 */
	if (!env.CF_PAGES) return resolve(event);

	const axiom = new Axiom({
		token: env.AXIOM_TOKEN,
		orgId: env.AXIOM_ORG_ID
	});
	const start = Date.now();
	const response = await resolve(event);
	const duration = Date.now() - start;

	const cf: Record<string, unknown> = {};
	if (event.platform?.cf) {
		// delete does not work so we copy into a new object
		Object.keys(event.platform.cf).forEach((key) => {
			if (key !== 'tlsClientAuth' && key !== 'tlsExportedAuthenticator') {
				cf[key] = event.platform && event.platform.cf && event.platform.cf[key];
			}
		});
	}

	const url = new URL(event.request.url);

	axiom.ingest(env.AXIOM_DATASET, {
		request: {
			deploymentURL: url.hostname,
			path: `${url.pathname}${url.search}`,
			...getHeaderMap(event.request.headers, ['user-agent']),
			method: event.request.method,
			ip: getHeaderMap(event.request.headers, ['cf-connecting-ip', 'x-forwarded-for', 'x-real-ip']),
			cf: {
				...cf
			}
		},
		response: {
			duration,
			headers: getHeaderMap(response.headers, ['cf-cache-status', 'cf-ray', 'cf-placement']),
			status: response.status
		}
	});
	await axiom.flush();

	return response;
};

export { reqLogger };
