import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";
import type { InferSelectModel } from "drizzle-orm";

export const sessions = sqliteTable("session", {
	sessionToken: text("sessionToken").notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull()
});

export const verificationTokens = sqliteTable(
	"verification_token",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token)
	})
);

export type SessionsModel = InferSelectModel<typeof sessions>;
export type VerificationTokensModel = InferSelectModel<typeof verificationTokens>;
