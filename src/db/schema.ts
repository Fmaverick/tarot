import { pgTable, serial, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  creditBalance: integer('credit_balance').default(10).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  spreadId: text('spread_id').notNull(),
  question: text('question').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cardsDrawn = pgTable('cards_drawn', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  cardId: text('card_id').notNull(),
  positionId: text('position_id').notNull(),
  isReversed: boolean('is_reversed').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  messages: many(messages),
  cardsDrawn: many(cardsDrawn),
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
