import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { domains } from "./domain";
import { links } from "./link";

export const UserStatus = ["active", "hold", "banned", "deleted"] as const;
export type UserStatusType = (typeof UserStatus)[number];

export const users = sqliteTable("user", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name"),
	email: text("email").unique().notNull(),
	status: text("status", { enum: UserStatus }).notNull().$type<UserStatusType>().default("active"),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text("image"),
	createdAt: integer("createdAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const usersRelations = relations(users, ({ many }) => ({
	domains: many(domains),
	links: many(links)
}));

export type UsersModel = InferSelectModel<typeof users>;
