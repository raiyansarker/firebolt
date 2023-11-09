import { db } from "$lib/server/db";
import { domains } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	const session = await event.locals.getSession();
	if (!session) throw error(403);

	// await db
	// 	.insert(domains)
	// 	.values({
	// 		name: "firebolt.raiyansarker.com",
	// 		ownerId: "jli7637fwewps1obtbt3a3zu"
	// 	})
	// 	.returning();

	const data = await db.select().from(domains);

	return new Response(JSON.stringify(data));
};
