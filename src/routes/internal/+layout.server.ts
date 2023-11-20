import { error } from "@sveltejs/kit";

export const load = async ({ isSubRequest }) => {
	if (!isSubRequest) {
		throw error(404);
	}
};
