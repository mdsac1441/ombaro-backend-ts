import {
    pgTable,
    uuid,
    timestamp,
    varchar
} from "drizzle-orm/pg-core";
import timestamps from "../common";
import { TokenType } from ".";

export const oneTimeToken = pgTable("one_time_tokens", {
  id: uuid().primaryKey().defaultRandom(),
  tokenId: varchar("token_id").notNull(),
  tokenType: varchar('token_type', { 
    enum: [TokenType.VERIFICATION, TokenType.RESET] 
  }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps
})