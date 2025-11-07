import { boolean, integer, jsonb, pgTable, uuid } from "drizzle-orm/pg-core";
import timestamps from "../common";


export const referralSettings = pgTable('referral_settings', {
  id: uuid('id').primaryKey().defaultRandom(),

  isMultiLevelEnabled: boolean('is_multi_level_enabled').default(false), /// Enable multi-level referrals
  maxLevels: integer('max_levels').default(1), /// Max depth for multi-level referrals
  metadata: jsonb("metadata"),
  ...timestamps
})
