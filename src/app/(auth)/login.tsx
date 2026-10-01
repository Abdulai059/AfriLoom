// app/(auth)/login.tsx
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthLoadingState = "idle" | "google" | "wallet";

const styles = {
  brandRow: "flex-row items-baseline justify-center mb-16",
  brandText: "text-4xl font-black text-slate-900 tracking-tight",
  brandDot: "h-1.5 w-1.5 rounded-full bg-[#59c51f] ml-1",
  headlineWrap: "items-center mb-12",
  headline: "text-2xl font-bold text-slate-900 text-center",
  subhead: "mt-2 text-base text-slate-500 text-center leading-6 max-w-[280px]",
  errorText: "text-sm text-red-500 text-center mb-4",
  buttonGroup: "gap-5",
  dividerRow: "flex-row items-center",
  dividerLine: "flex-1 h-px bg-slate-200",
  dividerLabel: "mx-4 text-xs font-medium text-slate-400",
  walletButton:
    "h-14 flex-row items-center justify-center rounded-2xl bg-[#59c51f] active:opacity-90",
  walletButtonText: "ml-3 text-base font-semibold text-white",
  footer: "flex-row justify-center items-center",
  footerText: "text-slate-400 text-sm",
  footerLink: "text-[#59c51f] font-bold text-sm",
};

export default function LoginScreen() {
  const router = useRouter();
  const { connect } = useMobileWallet();
  const [loading, setLoading] = useState<AuthLoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function upsertUserProfile(user: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, any>;
  }) {
    const { error: upsertError } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
    });
    if (upsertError) {
      console.log("Failed to upsert user profile", upsertError);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setLoading("google");
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type !== "success" || !response.data.idToken) {
        throw new Error("Google sign-in was cancelled or returned no token");
      }

      const { data, error: signInError } =
        await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken,
        });
      if (signInError) throw signInError;

      if (data.user) await upsertUserProfile(data.user);

      router.replace("/(tabs)");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading("idle");
    }
  }

  async function handleConnectWallet() {
    setError(null);
    setLoading("wallet");
    try {
      await connect();

      // TODO: replace with real Sign In With Solana (SIWS) verified against
      // Supabase, instead of an anonymous session, so the wallet address is
      // tied to an actual authenticated identity.
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) throw signInError;

      router.replace("/(tabs)");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not connect wallet";
      setError(message);
    } finally {
      setLoading("idle");
    }
  }

  const googleLoading = loading === "google";
  const walletLoading = loading === "wallet";
  const anyLoading = loading !== "idle";

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
    >
      {/* Inline padding so spacing works even if NativeWind isn't applied */}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingHorizontal: 32,
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        <View>
          <View className={styles.brandRow}>
            <Text className={styles.brandText}>AfriLoom</Text>
            <View className={styles.brandDot} />
          </View>

          <View className={styles.headlineWrap}>
            <Text className={styles.headline}>Welcome back</Text>
            <Text className={styles.subhead}>
              Sign in with Google or connect your Solana wallet to continue.
            </Text>
          </View>

          {error && (
            <Text className={styles.errorText} accessibilityLiveRegion="polite">
              {error}
            </Text>
          )}

          <View className={styles.buttonGroup}>
            <SocialAuthButtons
              onGooglePress={handleGoogleLogin}
              loading={googleLoading}
              disabled={anyLoading}
            />

            <View className={styles.dividerRow}>
              <View className={styles.dividerLine} />
              <Text className={styles.dividerLabel}>OR</Text>
              <View className={styles.dividerLine} />
            </View>

            <Pressable
              onPress={handleConnectWallet}
              disabled={anyLoading}
              accessibilityRole="button"
              accessibilityLabel="Connect Solana wallet"
              accessibilityState={{ disabled: anyLoading, busy: walletLoading }}
              className={`${styles.walletButton} ${
                anyLoading && !walletLoading ? "opacity-40" : ""
              }`}
            >
              {walletLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="wallet-outline" size={20} color="#fff" />
                  <Text className={styles.walletButtonText}>
                    Connect Wallet
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        <View className={styles.footer}>
          <Text className={styles.footerText}>
            Don&apos;t have an account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text className={styles.footerLink}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}




