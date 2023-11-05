import { redirect, type Handle } from "@sveltejs/kit";
import { pathToRegexp } from "path-to-regexp";

const privateRouteHandler: Handle = async ({ event, resolve }) => {
	const matcher = ["/app/:path*"];

	if (pathToRegexp(matcher).test(event.url.pathname)) {
		const user = await event.locals.getSession();
		if (!user) throw redirect(307, "/login");
	}

	return resolve(event);
};

export { privateRouteHandler };
