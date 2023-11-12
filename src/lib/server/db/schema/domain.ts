import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";

export const DomainStatus = ["active", "pending", "hold", "banned"] as const;
export type DomainStatusType = (typeof DomainStatus)[number];

export const domains = sqliteTable(
	"domain",
	{
		id: text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => createId()),
		ownerId: text("owner_id").notNull(),

		name: text("name").unique().notNull(),
		status: text("status", { enum: DomainStatus })
			.notNull()
			.$type<DomainStatusType>()
			.default("pending"),
		shared: integer("shared", { mode: "boolean" }).default(false),

		createdAt: integer("createdAt", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		ownerIdx: index("domain_owner_idx").on(table.ownerId),
		sharedIdx: index("domain_shared_idx").on(table.shared),
		name: index("domain_name").on(table.name)
	})
);

export const domainsRelations = relations(domains, ({ one }) => ({
	owner: one(users, {
		fields: [domains.ownerId],
		references: [users.id]
	})
}));

export type DomainsModel = InferSelectModel<typeof domains>;
