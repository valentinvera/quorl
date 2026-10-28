import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { agent } from "./agent"
import { user } from "./auth"

export const message = sqliteTable(
  "message",
  {
    agentId: text("agent_id")
      .notNull()
      .references(() => agent.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    id: text("id").primaryKey(),
    role: text("role").notNull().default("user"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("message_agentId_createdAt_idx").on(table.agentId, table.createdAt),
    index("message_userId_idx").on(table.userId),
  ]
)

export const messageRelations = relations(message, ({ one }) => ({
  agent: one(agent, {
    fields: [message.agentId],
    references: [agent.id],
  }),
  user: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
}))

export const messageSchema = {
  message,
  messageRelations,
} as const
