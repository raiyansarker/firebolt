import { db } from "$lib/server/db";
import { domains, links, users } from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

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
		return event.fetch(`/internal/${DOMAIN_NAME}`);
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
		return event.fetch(`/internal/${DOMAIN_NAME}/${KEY.base}`);
	}

	/**
	 * Expiration Guard
	 */
	if (link.expire !== null && new Date() > new Date(link.expire)) {
		return event.fetch(`/internal/${DOMAIN_NAME}/${KEY.base}/expired`); // use id for faster query
	}

	/**
	 * Password Guard
	 */
	if (link.password) {
		/**
		 * password would be provided in the search param
		 * redirect or rewrite if password is not provided
		 * or password is incorrect
		 */
		const password = event.url.searchParams.get("password");
		if (!password) {
			return event.fetch(`/internal/${DOMAIN_NAME}/${KEY.base}/password`);
		}

		/**
		 * TODO: rate limit password bruteforce
		 */
		if (!bcrypt.compareSync(password, link.password)) {
			const url = event.url;
			url.searchParams.delete("password");
			url.searchParams.set("error", "Invalid Passowrd");
			throw redirect(303, url);
		}
	}

	/**
	 * Details Page Guard
	 */
	if (KEY.details) {
		return event.fetch(`/internal/${DOMAIN_NAME}/${KEY.base}/details`);
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
