import { authHandler } from "$lib/server/hooks/auth";
import { privateRouteHandler } from "$lib/server/hooks/private-route";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const handle = sequence(authHandler, privateRouteHandler) satisfies Handle;
