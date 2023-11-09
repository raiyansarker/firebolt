import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import { nanoid } from "nanoid";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	return json({
		id: nanoid(Number(env.LINK_DEFAULT_SIZE ?? 6))
	});
};
