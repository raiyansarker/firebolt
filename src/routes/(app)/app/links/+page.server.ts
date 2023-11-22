import { db } from "$lib/server/db";
import { domains, links } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw error(401);

	return {
		links: await db
			.select({
				id: links.id,
				key: links.key,
				url: links.url,
				createdAt: links.createdAt,
				status: links.status,
				expire: links.expire,
				domain: {
					name: domains.name
				}
			})
			.from(links)
			.leftJoin(domains, eq(links.domainId, domains.id))
			.where(eq(links.ownerId, session.user.id))
			.orderBy(desc(links.createdAt))
			.limit(10)
	};
};
