import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity } from "react-native";

export default function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await GoogleSignin.signOut();
      await supabase.auth.signOut({ scope: "global" });
      await SecureStore.deleteItemAsync("authToken");
      await AsyncStorage.clear();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Logout failed", err);
      Alert.alert(
        "Error",
        "Something went wrong logging out. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  }

  function confirmLogout() {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: handleLogout },
    ]);
  }

  return (
    <TouchableOpacity
      onPress={confirmLogout}
      disabled={loggingOut}
      className="mt-6 bg-red-50 rounded-2xl py-4 flex-row items-center justify-center gap-2"
    >
      {loggingOut ? (
        <ActivityIndicator color="#ef4444" size="small" />
      ) : (
        <>
          <Feather name="log-out" size={18} color="#ef4444" />
          <Text className="text-red-500 font-semibold text-base">Logout</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
