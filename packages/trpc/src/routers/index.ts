import { protectedProcedure, publicProcedure, router } from "../index"
import { agentRouter } from "./agent"

export const appRouter = router({
  agent: agentRouter,

  healthCheck: publicProcedure.query(() => "OK"),

  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
})
export type AppRouter = typeof appRouter
