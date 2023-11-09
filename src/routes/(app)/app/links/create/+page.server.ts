import { serializeJson } from "$lib/utils";
import { fail } from "@sveltejs/kit";
import type { Domain } from "../../domains/types";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";

const linkCreateSchema = z.object({
	destinationUrl: z.string().url(),
	domainId: z.string().cuid2(),
	shortUrl: z.string().min(1)
});

export const load: PageServerLoad = async ({ fetch }) => {
	const domains = await fetch(
		`/api/domains/list?status=active&select=${serializeJson({ id: true, name: true })}`
	).then((res) => res.json() as Promise<Pick<Domain, "id" | "name">[]>);

	const form = await superValidate(
		/**
		 * Merge the schema with the default values for the form.
		 */
		linkCreateSchema.merge(
			z.object({
				domainId: z.string().cuid2().default(domains[0].id)
			})
		)
	);

	return {
		domains,
		form
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, linkCreateSchema);
		console.log("POST", form);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data

		// Yep, return { form } here too
		return { form };
	}
};
