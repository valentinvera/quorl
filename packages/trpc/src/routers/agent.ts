import { randomUUID } from "node:crypto"
import { db } from "@quorl/db"
import { agent } from "@quorl/db/schema/agent"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"
import { protectedProcedure, router } from "../index"

const agentInput = z.object({
  description: z.string().trim().max(280).optional(),
  name: z.string().trim().min(1).max(80),
  role: z.string().trim().min(1).max(80),
})

export const agentRouter = router({
  create: protectedProcedure
    .input(agentInput)
    .mutation(async ({ ctx, input }) => {
      const [created] = await db
        .insert(agent)
        .values({
          description: input.description || null,
          id: randomUUID(),
          name: input.name,
          role: input.role,
          userId: ctx.session.user.id,
        })
        .returning({
          description: agent.description,
          id: agent.id,
          name: agent.name,
          role: agent.role,
        })

      return created
    }),

  list: protectedProcedure.query(
    async ({ ctx }) =>
      await db
        .select({
          description: agent.description,
          id: agent.id,
          name: agent.name,
          role: agent.role,
        })
        .from(agent)
        .where(eq(agent.userId, ctx.session.user.id))
        .orderBy(desc(agent.createdAt))
  ),
})
