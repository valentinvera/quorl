import { randomUUID } from "node:crypto"
import { db } from "@quorl/db"
import { agent } from "@quorl/db/schema/agent"
import { message } from "@quorl/db/schema/message"
import { TRPCError } from "@trpc/server"
import { and, asc, eq } from "drizzle-orm"
import { z } from "zod"
import { protectedProcedure, router } from "../index"

const agentIdInput = z.object({ agentId: z.string().min(1) })

const sendInput = agentIdInput.extend({
  content: z.string().trim().min(1).max(4000),
})

export const messageRouter = router({
  list: protectedProcedure.input(agentIdInput).query(async ({ ctx, input }) => {
    const rows = await db
      .select({
        content: message.content,
        createdAt: message.createdAt,
        id: message.id,
        role: message.role,
      })
      .from(message)
      .where(
        and(
          eq(message.agentId, input.agentId),
          eq(message.userId, ctx.session.user.id)
        )
      )
      .orderBy(asc(message.createdAt))

    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }))
  }),

  send: protectedProcedure.input(sendInput).mutation(async ({ ctx, input }) => {
    const [owned] = await db
      .select({ id: agent.id })
      .from(agent)
      .where(
        and(eq(agent.id, input.agentId), eq(agent.userId, ctx.session.user.id))
      )
      .limit(1)

    if (!owned) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Teammate not found.",
      })
    }

    const [created] = await db
      .insert(message)
      .values({
        agentId: input.agentId,
        content: input.content,
        id: randomUUID(),
        role: "user",
        userId: ctx.session.user.id,
      })
      .returning({
        content: message.content,
        createdAt: message.createdAt,
        id: message.id,
        role: message.role,
      })

    if (!created) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Message could not be created.",
      })
    }

    return {
      ...created,
      createdAt: created.createdAt.toISOString(),
    }
  }),
})
