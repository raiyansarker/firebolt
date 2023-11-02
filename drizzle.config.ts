import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
	schema: "./src/lib/server/db/schema/**",
	out: "./src/lib/server/db/migrations",
	driver: "turso",
	breakpoints: true,
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		authToken: process.env.DATABASE_AUTH_TOKEN!
	}
} satisfies Config;
