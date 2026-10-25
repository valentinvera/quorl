import type { AppRouter } from "@quorl/trpc/routers/index"
import { createTRPCContext } from "@trpc/tanstack-react-query"

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>()
