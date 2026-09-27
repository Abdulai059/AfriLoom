import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        router.replace("/(tabs)");
      } else {
        // Redirect to login screen
        router.replace("/(auth)/login");
      }
    }
    checkAuth();
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <View className="flex-row items-baseline">
        <Text className="text-5xl font-black tracking-tight text-slate-900">
          AfriLoom
        </Text>
        <View className="h-2 w-2 rounded-full bg-[#59c51f] ml-0.5" />
      </View>

      <View className="absolute bottom-16">
        <ActivityIndicator size="large" color="#59c51f" />
      </View>
    </View>
  );
}
