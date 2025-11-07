import { pgTable, uuid, integer, index, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import timestamps from "../common"
import { referralCodes } from '.';
import { users } from '../user';


export const referralStatusEnum = pgEnum('status', [
  'ACTIVE',    
  'INACTIVE'
])

/// Referrals Table (who referred whom)
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referralCodeId: uuid('referral_code_id')
    .references(() => referralCodes.id, { onDelete: 'cascade' })
    .notNull(), /// The referral code used

  referrerId: uuid('referrer_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(), /// The one who referred

  refereeId: uuid('referee_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(), /// The one who got referred

  level: integer('level').default(1).notNull(), /// For multi-level tracking (level 1 = direct, level 2 = indirect, etc.)
  status: referralStatusEnum().default('ACTIVE').notNull(), /// Status of the referral (PENDING, COMPLETED, REJECTED, EXPIRED)

  metadata: jsonb("metadata"),
  ...timestamps

}, (t) => [
  index('referrer_status_idx').on(t.referrerId, t.status),
  index('level_status_idx').on(t.level, t.status),
])