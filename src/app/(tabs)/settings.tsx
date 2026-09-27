import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Settings() {
  const router = useRouter();

  async function handleLogout() {
    await GoogleSignin.signOut();
    await supabase.auth.signOut({ scope: "global" });
    await SecureStore.deleteItemAsync("authToken");
    await AsyncStorage.clear();
    router.replace("/(auth)/login");
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-semibold mb-8">Settings</Text>
        <Pressable
          onPress={handleLogout}
          className="px-6 py-3 bg-red-500 rounded-xl"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
