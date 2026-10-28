import { Redirect, useRouter } from "expo-router"
import { Button } from "heroui-native"
import { useCallback } from "react"
import { Text, View } from "react-native"
import { authClient } from "@/lib/auth-client"

export default function Home() {
  const router = useRouter()
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
    <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
      <Text className="font-geist-bold text-foreground text-subtitle">
        Quorl
      </Text>
      <Text className="font-geist-regular text-body text-muted-foreground">
        {session.user.email}
      </Text>
      <View className="pt-6">
        <Button onPress={handleSignOut} variant="outline">
          <Button.Label>Sign out</Button.Label>
        </Button>
      </View>
    </View>
  )
}
