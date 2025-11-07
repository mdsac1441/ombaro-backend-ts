import { pgEnum } from "drizzle-orm/pg-core";


export const notificationTypeEnum = pgEnum('type', [
    'SECURITY',
    'ACTIVITY',
    'SYSTEM',
])