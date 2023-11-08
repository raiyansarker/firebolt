import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";
import { domains } from "./domain";

export const LinkStatus = ["active", "hold", "banned"] as const;
export type LinkStatusType = (typeof LinkStatus)[number];

export const links = sqliteTable("link", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	ownerId: text("owner_id").notNull(),
	domainId: text("domain_id").notNull(),
	shortUrl: text("short_url").unique().notNull(),
	destinationUrl: text("destinationUrl").notNull(),
	status: text("status", { enum: LinkStatus }).notNull().$type<LinkStatusType>().default("active"),
	createdAt: integer("createdAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const linksRelations = relations(links, ({ one }) => ({
	owner: one(users, {
		fields: [links.ownerId],
		references: [users.id]
	}),
	domain: one(domains, {
		fields: [links.domainId],
		references: [domains.id]
	})
}));

export type LinksModel = InferSelectModel<typeof links>;
