import { db } from "$lib/server/db";
import { domains, links } from "$lib/server/db/schema";
import { engineRedirect } from "$lib/utils/redirect.server";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET = async ({ params }) => {
	const linkKey = params.slug.split("+").length > 1 ? params.slug.split("+")[0] : params.slug;

	const link = await db
		.select({
			url: links.url,
			status: links.status
		})
		.from(links)
		.leftJoin(domains, eq(links.domainId, domains.id))
		.where(eq(links.key, linkKey))
		.limit(1)
		.then((data) => data[0]);

	if (!link) throw error(404);
	if (link.status !== "active") throw error(403);

	return engineRedirect(link.url);
};
