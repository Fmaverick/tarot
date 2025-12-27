import { pgTable, serial, text, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  creditBalance: integer('credit_balance').default(10).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  spreadId: text('spread_id').notNull(),
  question: text('question').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const redemptionCodes = pgTable('redemption_codes', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  points: integer('points').notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  usedBy: integer('used_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  usedAt: timestamp('used_at'),
});

export const cardsDrawn = pgTable('cards_drawn', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').notNull().references(() => sessions.id),
  cardId: text('card_id').notNull(),
  positionId: text('position_id').notNull(),
  isReversed: boolean('is_reversed').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').notNull().references(() => sessions.id),
  role: text('role').notNull(), // 'user' or 'assistant' usually
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  redemptionCodes: many(redemptionCodes),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  messages: many(messages),
  cardsDrawn: many(cardsDrawn),
}));

export const redemptionCodesRelations = relations(redemptionCodes, ({ one }) => ({
  user: one(users, {
    fields: [redemptionCodes.usedBy],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  session: one(sessions, {
    fields: [messages.sessionId],
    references: [sessions.id],
  }),
}));

export const cardsDrawnRelations = relations(cardsDrawn, ({ one }) => ({
  session: one(sessions, {
    fields: [cardsDrawn.sessionId],
    references: [sessions.id],
  }),
}));
