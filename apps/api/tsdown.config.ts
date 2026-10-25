import { defineConfig } from "tsdown"

export default defineConfig({
  deps: {
    alwaysBundle: /^@quorl\//,
  },
})
