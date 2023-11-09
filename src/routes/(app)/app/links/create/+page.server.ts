import { db } from "$lib/server/db";
import type { DomainsModel } from "$lib/server/db/schema";
import { error, fail } from "@sveltejs/kit";
import { sql } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const _linkCreateSchema = z.object({
	destinationUrl: z.string().url(),
	domainId: z.string().cuid2(),
	shortUrl: z.string().optional()
});

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw error(401);

	/**
	 * TODO: You can add a limit to these queries to prevent overloading the server.
	 * But for now, we'll just load all of them.
	 * FIXME: This is a temporary solution as drizzle doesn't support union queries yet but it is in beta version
	 * ISSUE: https://github.com/drizzle-team/drizzle-orm/issues/207
	 * PR: https://github.com/drizzle-team/drizzle-orm/pull/1218
	 */
	const domains = (await db.all(
		sql`select "id", "name" from "domain" where "domain"."owner_id" = ${session.user.id} union select "id", "name" from "domain" where "domain"."shared" = 1`
	)) as Pick<DomainsModel, "id" | "name">[];

	const form = await superValidate(
		/**
		 * Merge the schema with the default values for the form.
		 */
		_linkCreateSchema.merge(
			z.object({
				domainId: z.string().default(domains[0].id ?? "")
			})
		)
	);

	return {
		domains,
		form
	};
};

export const actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(await request.formData(), _linkCreateSchema);

		if (!form.valid) {
			return message(form, {
				type: "error",
				text: "Invalid form"
			});
		}

		console.log(form.data);

		const response = await fetch("/api/links/create", {
			method: "POST",
			body: JSON.stringify(form.data)
		}).catch((error) => {
			return fail(400, { form, error });
		});

		console.log(response.status);
		if (response.status === 200) {
			return message(form, {
				type: "success",
				text: "Link created successfully"
			});
		} else {
			return message(form, {
				type: "error",
				text: "Link creation failed"
			});
		}
	}
};
