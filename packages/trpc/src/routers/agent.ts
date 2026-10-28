import { randomUUID } from "node:crypto"
import { db } from "@quorl/db"
import { agent } from "@quorl/db/schema/agent"
import { TRPCError } from "@trpc/server"
import { and, desc, eq } from "drizzle-orm"
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

  get: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [found] = await db
        .select({
          description: agent.description,
          id: agent.id,
          name: agent.name,
          role: agent.role,
        })
        .from(agent)
        .where(
          and(eq(agent.id, input.id), eq(agent.userId, ctx.session.user.id))
        )
        .limit(1)

      return found ?? null
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

  update: protectedProcedure
    .input(agentInput.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db
        .update(agent)
        .set({
          description: input.description || null,
          name: input.name,
          role: input.role,
        })
        .where(
          and(eq(agent.id, input.id), eq(agent.userId, ctx.session.user.id))
        )
        .returning({
          description: agent.description,
          id: agent.id,
          name: agent.name,
          role: agent.role,
        })

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Teammate not found.",
        })
      }

      return updated
    }),
})
