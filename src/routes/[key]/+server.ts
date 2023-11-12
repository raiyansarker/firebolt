import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { domains, links } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";

export const GET = async (event) => {
	/**
	 * Constants
	 */
	const DOMAIN_NAME = event.request.headers.get("host")!;
	const KEY = {
		base: event.params.key.split("+")[0],
		details: event.params.key.split("+").length > 1
	};

	/**
	 * Domain Guard
	 */
	const domain = await db
		.select({
			id: domains.id,
			status: domains.status
		})
		.from(domains)
		.where(eq(domains.name, DOMAIN_NAME))
		.limit(1)
		.then((rows) => rows[0]);
	if (!domain || domain.status !== "active") {
		return event.fetch(`/internal/domain/${DOMAIN_NAME}`);
	}

	/**
	 * Link Guard
	 */
	const link = await db
		.select({
			id: links.id,
			status: links.status,
			expire: links.expire,
			password: links.password,
			url: links.url
		})
		.from(links)
		.where(eq(links.key, KEY.base))
		.limit(1)
		.then((rows) => rows[0]);
	if (!link) throw error(404, "Not Found");
	if (link.status !== "active") {
		return event.fetch(`/internal/domain/${KEY.base}`);
	}

	/**
	 * Expiration Guard
	 */
	if (link.expire !== null && new Date() > new Date(link.expire)) {
		return event.fetch(`/internal/link/${link.id}/expired`); // use id for faster query
	}

	/**
	 * Password Guard
	 */
	if (link.password) {
		return event.fetch(`/internal/link/${link.id}/password`);
	}

	/**
	 * Details Page Guard
	 */
	if (KEY.details) {
		return event.fetch(`/internal/link/${link.id}/details`);
	}

	/**
	 * Redirect
	 */
	return new Response(null, {
		status: 307,
		headers: {
			location: link.url,
			"X-Engine": "firebolt 1.0"
		}
	});
};
