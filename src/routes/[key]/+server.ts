import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { domains, links, users } from "$lib/server/db/schema";
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
			status: domains.status,
			owner: {
				status: users.status
			}
		})
		.from(domains)
		.leftJoin(users, eq(domains.ownerId, users.id))
		.where(eq(domains.name, DOMAIN_NAME))
		.limit(1)
		.then((rows) => rows[0]);
	if (!domain || domain.status !== "active") {
		return event.fetch(`/internal/domain/${DOMAIN_NAME}`);
	}

	/**
	 * Owner Status Guard
	 *
	 * check if the owner of the domain is banned or deleted to prevent redirection
	 * deleted is used to identify soft deletes which are not yet removed from the database. eventually they will be removed
	 * banned is used to identify users who are banned from the service and can't access the service anymore, for spam prevention
	 *
	 * FIXME: this works for now but it should be modified when teams support lands
	 */
	if (domain.owner?.status === "deleted" || domain.owner?.status === "banned") {
		throw error(404, "Not Found");
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
