import { Redirect, useRouter } from "expo-router"
import { Button } from "heroui-native"
import { useCallback } from "react"
import { Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AgentRoster } from "@/components/agent-roster"
import { authClient } from "@/lib/auth-client"

export default function Home() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = useCallback(async () => {
    await authClient.signOut()
    router.replace("/login")
  }, [router])

  if (isPending) {
    return <View className="flex-1 bg-background" />
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  return (
    <View
      className="flex-1 gap-4 bg-background px-6"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-geist-bold text-emphasis text-foreground">
            Quorl
          </Text>
          <Text className="font-geist-regular text-caption text-muted-foreground">
            {session.user.email}
          </Text>
        </View>
        <Button onPress={handleSignOut} size="sm" variant="ghost">
          <Button.Label>Sign out</Button.Label>
        </Button>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom,
        }}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        <View className="py-6">
          <AgentRoster />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}
