import { env } from "$env/dynamic/private";
import { db } from "$lib/server/db";
import { links } from "$lib/server/db/schema";
import { error, json } from "@sveltejs/kit";
import { nanoid } from "nanoid";
import { fromZodError } from "zod-validation-error";
import { _linkCreateSchema } from "../../../(app)/app/links/create/+page.server";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	if (!session) throw error(401);

	const parse = _linkCreateSchema.safeParse(await request.json());
	if (!parse.success) throw error(400, fromZodError(parse.error));

	const body = parse.data;

	const data = await db
		.insert(links)
		.values({
			ownerId: session.user.id,
			domainId: body.domainId,
			destinationUrl: body.destinationUrl,
			shortUrl: body.shortUrl ?? nanoid(Number(env.LINK_DEFAULT_SIZE ?? 6))
		})
		.returning();

	return json(data);
};
