import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { nanoid } from "nanoid";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async () => {
	return json({
		id: nanoid(Number(env.LINK_DEFAULT_SIZE ?? 6))
	});
};
