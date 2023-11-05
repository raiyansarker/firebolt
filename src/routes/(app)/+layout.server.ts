import { pathToRegexp } from "path-to-regexp";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
	const matcher = ["/app/:path*"];
	const session = await event.locals.getSession();

	console.log(event.url.pathname, pathToRegexp(matcher).test(event.url.pathname));

	if (pathToRegexp(matcher).test(event.url.pathname)) {
		if (!session) throw redirect(307, "/login");
	}

	return {
		session
	};
};
