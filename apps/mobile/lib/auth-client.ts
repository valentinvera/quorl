import { expoClient } from "@better-auth/expo/client"
import { env } from "@quorl/env/mobile"
import { createAuthClient } from "better-auth/react"
import Constants from "expo-constants"
import { getItem, getItemAsync, setItem, setItemAsync } from "expo-secure-store"

const secureStore = {
  getItem,
  getItemAsync,
  setItem,
  setItemAsync,
} as const

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storage: secureStore,
      storagePrefix: Constants.expoConfig?.scheme as string,
    }),
  ],
})
