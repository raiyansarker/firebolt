import { env } from "$env/dynamic/private";
import { db } from "$lib/server/db";
import { domains as domainsTable, links, type LinksModel } from "$lib/server/db/schema";
import { zodEnhanced } from "$lib/utils";
import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { message, superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import type { PageServerLoad } from "./$types";

const linkCreateSchema = zodEnhanced<
	Pick<LinksModel, "url" | "password" | "expire" | "domainId"> & Partial<Pick<LinksModel, "key">>
>().with({
	url: z.string().url(),
	domainId: z.string().cuid2({ message: "Select a valid domain" }),
	key: z
		.string()
		.regex(/^[A-Za-z0-9_-]+$/)
		.optional(),
	password: z.string().min(6).nullable(),
	expire: z.coerce.date().nullable()
});

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) throw error(401);

	const domains = await db
		.select({ id: domainsTable.id, name: domainsTable.name })
		.from(domainsTable)
		.where(and(eq(domainsTable.ownerId, session.user.id), eq(domainsTable.status, "active")))
		.union(
			db
				.select({ id: domainsTable.id, name: domainsTable.name })
				.from(domainsTable)
				.where(and(eq(domainsTable.shared, true), eq(domainsTable.status, "active")))
		);

	const form = await superValidate(linkCreateSchema);

	return {
		form,
		domains
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) throw error(401);
		const form = await superValidate(await request.formData(), linkCreateSchema);

		if (!form.valid) {
			/**
			 * make sure to remove the password from the form data
			 * when the form is invalid. and even when password is present
			 */
			form.data = { ...form.data, password: null };

			return message(form, "Invalid form", {
				status: 400
			});
		}

		/**
		 * TODO: add dictionary to check for reserved keys like default application paths
		 */

		/**
		 * check for existing short url only when it is provided.
		 * IMPORTANT: keys are unique and uniqueness is scoped to domain
		 */
		const linkExists =
			form.data.key &&
			(await db
				.select({ id: links.id })
				.from(links)
				.where(and(eq(links.domainId, form.data.domainId), eq(links.key, form.data.key)))
				.limit(1)
				.then((data) => data[0]));
		if (linkExists && linkExists.id) {
			/**
			 * make sure to remove the password from the form data
			 * when the form is invalid. and even when password is present
			 */
			form.data = { ...form.data, password: null };

			return message(form, "Short url is already taken", {
				status: 400
			});
		}

		const key = form.data.key ?? nanoid(Number(env.LINK_DEFAULT_SIZE ?? 6));
		const password = form.data.password ? bcrypt.hashSync(form.data.password) : null; // never store plain password
		const data = await db
			.insert(links)
			.values({
				...form.data,
				key: key,
				ownerId: session.user.id,
				password
			})
			.catch((error) => {
				console.log(error);
				return message(form, "Link creation failed", {
					status: 400
				});
			});

		if (!data) {
			/**
			 * make sure to remove the password from the form data
			 * when the form is invalid. and even when password is present
			 */
			form.data = { ...form.data, password: null };

			return message(form, "Something went wrong", {
				status: 400
			});
		}

		return message(
			{ ...form, data: { ...form.data, password: null, key } },
			"Link created successfully"
		);
	}
};
