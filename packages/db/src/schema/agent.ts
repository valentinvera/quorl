import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { user } from "./auth"

export const agent = sqliteTable(
  "agent",
  {
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    description: text("description"),
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("agent_userId_idx").on(table.userId)]
)

export const agentRelations = relations(agent, ({ one }) => ({
  user: one(user, {
    fields: [agent.userId],
    references: [user.id],
  }),
}))

export const agentSchema = {
  agent,
  agentRelations,
} as const
