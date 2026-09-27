import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Pressable, Text, View } from "react-native";

export default function Settings() {
  const router = useRouter();

  async function handleLogout() {
    await SecureStore.deleteItemAsync("authToken");
    router.replace("/(auth)/login");
  }

  return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <Text className="text-2xl font-semibold mb-8">Settings</Text>
      <Pressable
        onPress={handleLogout}
        className="px-6 py-3 bg-red-500 rounded-xl"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </Pressable>
    </View>
  );
}
