import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";
import { domains } from "./domain";
import { nanoid } from "nanoid";

export const LinkStatus = ["active", "hold", "banned"] as const;
export type LinkStatusType = (typeof LinkStatus)[number];

export const links = sqliteTable(
	"link",
	{
		id: text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => createId()),
		ownerId: text("owner_id").notNull(),
		domainId: text("domain_id").notNull(),

		key: text("key")
			.notNull()
			.$defaultFn(() => nanoid(6)),
		url: text("url").notNull(),

		status: text("status", { enum: LinkStatus })
			.notNull()
			.$type<LinkStatusType>()
			.default("active"),
		password: text("password"), // has to be hashed
		expire: integer("expire", { mode: "timestamp_ms" }), // should also be used to identify expired links
		delay: integer("delay", { mode: "number" }), // has to be in seconds (min -> 1, max -> 60)
		clicks: integer("clicks", { mode: "number" }).default(0),

		createdAt: integer("createdAt", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		keyIdx: index("link_key_idx").on(table.key),
		ownerIdx: index("link_owner_idx").on(table.ownerId),
		domainIdx: index("link_domain_idx").on(table.domainId)
	})
);

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
