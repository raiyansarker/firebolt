import { db } from "$lib/server/db";
import { domains } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw error(401);

	return {
		domains: await db
			.select({
				id: domains.id,
				name: domains.name,
				status: domains.status,
				updatedAt: domains.updatedAt
			})
			.from(domains)
			.where(eq(domains.ownerId, session.user.id))
			.limit(10)
	};
};
