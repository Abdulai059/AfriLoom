// app/(auth)/signup.tsx
import { BackButton } from "@/components/BackButton";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const { connect } = useMobileWallet();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);

  async function handleGoogleSignup() {
    try {
      setLoadingGoogle(true);

      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type !== "success" || !response.data.idToken) {
        throw new Error("Google sign-in failed");
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.data.idToken,
      });

      if (error) throw error;

      // Profile is auto-created by the database trigger
      // Go to onboarding
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log(err);
      Alert.alert("Google signup failed", err?.message || "Something went wrong");
    } finally {
      setLoadingGoogle(false);
    }
  }

  async function handleConnectWallet() {
    setLoadingWallet(true);
    try {
      const wallet = await connect();
      // TODO: Proper Solana wallet auth later
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Wallet connection failed", err?.message || "Could not connect wallet");
    } finally {
      setLoadingWallet(false);
    }
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950 px-8 pt-12 justify-between pb-12">
      <View>
        <BackButton />

        {/* Brand */}
        <View className="flex-row items-baseline justify-center mb-14 mt-4">
          <Text className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            AfriLoom
          </Text>
          <View className="h-1.5 w-1.5 rounded-full bg-[#59c51f] ml-1" />
        </View>

        {/* Headline */}
        <View className="items-center mb-12">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center">
            Create your account
          </Text>
          <Text className="mt-2 text-[15px] text-slate-500 dark:text-slate-400 text-center leading-6 max-w-[280px]">
            Sign up with Google or connect your Solana wallet to get started.
          </Text>
        </View>

        {/* Auth buttons */}
        <View className="gap-5">
          <SocialAuthButtons
            onGooglePress={handleGoogleSignup}
            loading={loadingGoogle}
          />

          {/* Divider */}
          <View className="flex-row items-center">
            <View className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <Text className="mx-4 text-xs font-medium text-slate-400">OR</Text>
            <View className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </View>

          <Pressable
            onPress={handleConnectWallet}
            disabled={loadingGoogle || loadingWallet}
            className="h-14 flex-row items-center justify-center rounded-2xl bg-[#59c51f] active:opacity-90"
          >
            {loadingWallet ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="wallet-outline" size={20} color="#fff" />
                <Text className="ml-3 text-base font-semibold text-white">
                  Connect Wallet
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-center items-center mb-10">
        <Text className="text-slate-400 text-sm">Already have an account? </Text>
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text className="text-[#59c51f] font-bold text-sm">Log in</Text>
        </Pressable>
      </View>
    </View>
  );
}