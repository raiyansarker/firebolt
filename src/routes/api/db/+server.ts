import { db } from "$lib/server/db";
import { domains } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	const session = await event.locals.getSession();
	if (!session) throw error(403);

	// const data = await db
	// 	.insert(domains)
	// 	.values({
	// 		name: "firebolt.pages.dev",
	// 		ownerId: session.user.id
	// 	})
	// 	.returning();

	const data = await db.select().from(domains);

	return new Response(JSON.stringify(data));
};
