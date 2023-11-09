import { db } from "$lib/server/db";
import { domains, links } from "$lib/server/db/schema";
import type { Handle } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

const redirectEngine: Handle = async ({ event, resolve }) => {
	// const hostInfo = await db
	// 	.select({ status: domains.status })
	// 	.from(domains)
	// 	.where(eq(domains.name, event.request.headers.get("host")!))
	// 	.get();

	// if (!hostInfo) return resolve(event);
	const link = await db
		.select({
			destinationUrl: links.destinationUrl
		})
		.from(links)
		.leftJoin(domains, eq(links.domainId, domains.id))
		.where(
			and(
				eq(links.shortUrl, event.url.pathname.substring(1)),
				eq(links.status, "active"),
				eq(domains.status, "active")
			)
		)
		.get();

	if (link) {
		event.setHeaders({
			"X-Engine": "firebolt/1.0"
		});
		return new Response(null, {
			status: 302,
			headers: {
				location: link.destinationUrl,
				"X-Engine": "firebolt/1.0"
			}
		});
	}

	return resolve(event);
};

export { redirectEngine };
