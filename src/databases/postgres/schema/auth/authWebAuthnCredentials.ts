import { boolean, index, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import timestamps from "../common"
import { auths } from "."

export const authWebAuthnCredentials = pgTable("auth_webauthn_credentials", {
  id: uuid().primaryKey().defaultRandom(),

  authId: uuid("auth_id").references(() => auths.id, { onDelete: "cascade" }).notNull(),
  
  credentialId: varchar("credential_id", { length: 255 }).unique().notNull(),
  publicKey: varchar("public_key").notNull(),
  transports: varchar("transports", { length: 255 }),
  counter: integer("counter").default(0),

  /// Status and metadata
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at"),
  nickname: varchar("nickname", { length: 100 }), /// User-friendly name

  ...timestamps
},
  (table) => [
    index("auth_webauthn_auth_idx").on(table.authId),
  ])