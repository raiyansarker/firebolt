import { authHandler } from "$lib/server/hooks/auth";
import { privateRouteHandler } from "$lib/server/hooks/private-route";
import { redirectEngine } from "$lib/server/hooks/redirect";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const handle = sequence(authHandler, privateRouteHandler, redirectEngine) satisfies Handle;
