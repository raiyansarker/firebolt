import { db } from "$lib/server/db";
import { domains } from "$lib/server/db/schema";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export const GET: RequestHandler = async ({ locals, url: { searchParams } }) => {
	const session = await locals.getSession();
	if (!session) throw error(401);

	const routeSchema = z.object({
		limit: z.coerce.number().nonnegative().max(100).optional().default(10)
	});

	const parse = routeSchema.safeParse({
		limit: searchParams.get("limit")
	});
	if (!parse.success) throw error(400, fromZodError(parse.error));

	/**
	 * Destructure all available query parameters
	 */
	const { limit } = parse.data;

	const data = await db.query.domains.findMany({
		where: eq(domains.ownerId, session.user.id),
		limit // if limit set to 0, drizzle won't use limit
	});

	return json(data);
};
