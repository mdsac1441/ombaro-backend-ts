import { boolean, index, integer, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import timestamps from "../common"
import { authProvidersEnum, auths } from "."

export const authProviders = pgTable("auth_providers", {
  id: uuid().primaryKey().defaultRandom(),

  authId: uuid("auth_id").references(() => auths.id, { onDelete: "cascade" }).notNull(),

  provider: authProvidersEnum().notNull(),
  providerSocialId: varchar("provider_social_id", { length: 255 }).notNull(),

  email: varchar("email"),
  name: varchar("name"),
  avatar: varchar("avatar"),
  metadata: jsonb("metadata"), /// Store additional provider-specific data

  /// Status
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at"),
  ...timestamps
},
  (table) => [
    index("auth_providers_auth_idx").on(
      table.authId,
      table.provider
    )
  ])