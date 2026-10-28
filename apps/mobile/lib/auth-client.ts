import { expoClient } from "@better-auth/expo/client"
import { env } from "@quorl/env/mobile"
import { createAuthClient } from "better-auth/react"
import Constants from "expo-constants"
import {
  deleteItemAsync,
  getItem,
  getItemAsync,
  setItem,
  setItemAsync,
} from "expo-secure-store"
import { Platform } from "react-native"

interface WebStorage {
  getItem: (key: string) => string | null
  removeItem: (key: string) => void
  setItem: (key: string, value: string) => void
}

function getWebStorage(): WebStorage | undefined {
  return (globalThis as { localStorage?: WebStorage }).localStorage
}

const secureStore = {
  deleteItemAsync,
  getItem,
  getItemAsync,
  setItem,
  setItemAsync,
} as const

const webStorage = {
  deleteItemAsync: (key: string) => {
    getWebStorage()?.removeItem(key)
    return Promise.resolve()
  },
  getItem: (key: string) => getWebStorage()?.getItem(key) ?? null,
  getItemAsync: (key: string) =>
    Promise.resolve(getWebStorage()?.getItem(key) ?? null),
  setItem: (key: string, value: string) => {
    getWebStorage()?.setItem(key, value)
  },
  setItemAsync: (key: string, value: string) => {
    getWebStorage()?.setItem(key, value)
    return Promise.resolve()
  },
} as const

const storage = Platform.OS === "web" ? webStorage : secureStore

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storage,
      storagePrefix: Constants.expoConfig?.scheme as string,
    }),
  ],
})
