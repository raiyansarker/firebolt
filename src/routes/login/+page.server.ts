import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const user = await locals.getSession();
	if (user) throw redirect(307, "/app");
};
