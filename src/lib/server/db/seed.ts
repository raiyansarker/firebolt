import type { InferInsertModel, Logger } from "drizzle-orm";
import { accounts, domains, links, users } from "./schema";
import { createClient } from "@libsql/client";
import chalk from "chalk";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { hashSync } from "bcryptjs";

(async () => {
	const connection = createClient({
		url: process.env.DATABASE_URL as string,
		authToken: process.env.DATABASE_AUTH_TOKEN as string | undefined
	});

	class CustomLogger implements Logger {
		logQuery(query: string, params: unknown[]): void {
			console.log(
				`${chalk.blueBright("Query")} : ${chalk.greenBright(query)} - ${chalk.yellowBright(params)}`
			);
		}
	}
	const db = drizzle(connection, { logger: new CustomLogger(), schema });

	const userIds = await db
		.insert(users)
		.values([
			{
				email: "user@example.com",
				name: "Test User",
				image: "https://github.com/raiyansarker.png",
				status: "active",
				emailVerified: new Date()
			},
			/**
			 * Don't take it seriously
			 */
			{
				email: "rich@svelte.dev",
				name: "Rich Harris",
				image: "https://github.com/Rich-Harris.png",
				status: "active"
			}
		])
		.returning({ id: users.id });

	await db.insert(accounts).values({
		provider: "github",
		type: "oauth",
		providerAccountId: userIds[1].id,
		userId: userIds[1].id
	});

	const domainIds = await db
		.insert(domains)
		.values([
			{
				name: "localhost:3000",
				ownerId: userIds[0].id,
				shared: true,
				status: "active"
			},
			{
				name: "localhost",
				ownerId: userIds[1].id,
				shared: true,
				status: "active"
			},
			{
				name: "firebolt.raiyansarker.local",
				ownerId: userIds[1].id,
				shared: true,
				status: "active"
			},
			{
				name: "go.raiyansarker.local",
				ownerId: userIds[1].id,
				shared: true
			},
			{
				name: "test1.raiyansarker.local",
				ownerId: userIds[0].id,
				status: "active"
			},
			{
				name: "test2.raiyansarker.local",
				ownerId: userIds[1].id
			}
		])
		.returning({ id: domains.id });

	await db.insert(links).values(
		domainIds
			.map((instance) => {
				return [
					{
						url: "https://github.com",
						ownerId: userIds[0].id,
						domainId: instance.id,
						key: "github"
					},
					{
						url: "https://github.com",
						ownerId: userIds[0].id,
						domainId: instance.id,
						key: "protected",
						password: hashSync("password")
					},
					{
						url: "https://github.com",
						ownerId: userIds[0].id,
						domainId: instance.id,
						key: "expired",
						expire: new Date()
					},
					{
						url: "https://github.com",
						ownerId: userIds[0].id,
						domainId: instance.id,
						key: "expired-protected",
						password: hashSync("password"),
						expire: new Date()
					},
					{
						url: "https://github.com",
						ownerId: userIds[0].id,
						domainId: instance.id,
						key: "not-expired",
						expire: (() => {
							const date = new Date();
							date.setFullYear(date.getFullYear() + 2);
							return date;
						})()
					},
					{
						url: "https://twitter.com",
						ownerId: userIds[0].id,
						domainId: instance.id,
						key: "twitter"
					},
					{
						url: "https://google.com",
						ownerId: userIds[0].id,
						domainId: instance.id,
						key: "google"
					},
					{
						url: "https://example.com",
						ownerId: userIds[0].id,
						domainId: instance.id
					}
				] satisfies InferInsertModel<typeof links>[];
			})
			.flat()
	);
})();
