/**
 * Redirects to the specified URL with the given HTTP status code.
 * @param url - The URL to redirect to.
 * @param status - The HTTP status code to use for the redirect. Defaults to 307.
 * @returns A Response object with the specified status code and location header.
 */
const engineRedirect = (url: string, status: number = 307) => {
	return new Response(null, {
		status,
		headers: {
			location: url,
			"X-Engine": "firebolt 1.0"
		}
	});
};

export { engineRedirect };
