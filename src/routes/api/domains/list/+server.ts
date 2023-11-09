import { db } from "$lib/server/db";
import { DomainStatus, domains, type DomainsModel } from "$lib/server/db/schema";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { zodEnhanced, type InferPartialSelect } from "$lib/utils";

export const GET: RequestHandler = async ({ locals, url: { searchParams } }) => {
	const session = await locals.getSession();
	if (!session) throw error(401);

	const routeSchema = z.object({
		limit: z.coerce.number().nonnegative().max(100).optional().default(10),
		status: z.enum(DomainStatus).optional(),
		select: zodEnhanced<InferPartialSelect<Omit<DomainsModel, "ownerId">>>()
			.with({
				id: z.boolean().default(true).optional(),
				name: z.boolean().optional(),
				status: z.boolean().optional(),
				createdAt: z.boolean().optional(),
				updatedAt: z.boolean().optional()
			})
			.optional()
	});

	const encodedSearchParam = searchParams.get("select") ?? undefined;

	const parse = routeSchema.safeParse({
		limit: searchParams.get("limit") ?? undefined,
		status: searchParams.get("status") ?? undefined,
		select: encodedSearchParam && JSON.parse(encodedSearchParam)
	});
	if (!parse.success) throw error(400, fromZodError(parse.error));

	/**
	 * Destructure all available query parameters
	 */
	const { limit, status, select } = parse.data;

	const data = await db.query.domains.findMany({
		columns: select && {
			...select
		},
		where: and(eq(domains.ownerId, session.user.id), status && eq(domains.status, status)),
		limit // if limit set to 0, drizzle won't use limit
	});

	return json(data);
};
