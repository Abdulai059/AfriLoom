// app/(auth)/signup.tsx
import { BackButton } from "@/components/BackButton";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthLoadingState = "idle" | "email" | "google" | "wallet";

const styles = {
  brandRow: "flex-row items-baseline justify-center mb-8 mt-2",
  brandText: "text-4xl font-black text-slate-900 tracking-tight",
  brandDot: "h-1.5 w-1.5 rounded-full bg-[#59c51f] ml-1",
  headlineWrap: "items-center mb-8",
  headline: "text-2xl font-bold text-slate-900 text-center",
  subhead: "mt-2 text-base text-slate-500 text-center leading-6 max-w-[280px]",
  errorText: "text-sm text-red-500 text-center mb-4",
  fieldGroup: "gap-3 mb-4",
  label: "text-xs font-semibold text-slate-500 mb-1.5 ml-1",
  input:
    "h-14 px-4 rounded-2xl bg-white border border-slate-200 text-base text-slate-900",
  passwordWrap: "relative",
  eyeButton: "absolute right-4 top-0 bottom-0 justify-center",
  emailButton:
    "h-14 flex-row items-center justify-center rounded-2xl bg-slate-900 active:opacity-90 mb-5",
  emailButtonText: "text-base font-semibold text-white",
  buttonGroup: "gap-5",
  dividerRow: "flex-row items-center",
  dividerLine: "flex-1 h-px bg-slate-200",
  dividerLabel: "mx-4 text-xs font-medium text-slate-400",
  walletButton:
    "h-14 flex-row items-center justify-center rounded-2xl bg-[#59c51f] active:opacity-90",
  walletButtonText: "ml-3 text-base font-semibold text-white",
  footer: "flex-row justify-center items-center mt-6",
  footerText: "text-slate-400 text-sm",
  footerLink: "text-[#59c51f] font-bold text-sm",
};

export default function SignUpScreen() {
  const router = useRouter();
  const { connect } = useMobileWallet();
  const [loading, setLoading] = useState<AuthLoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleEmailSignup() {
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError("Please enter email and password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading("email");
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });
      if (signUpError) throw signUpError;

      // If email confirmation is enabled, session may be null
      if (data.session) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Check your email",
          "We sent you a confirmation link. Open it, then log in.",
          [{ text: "OK", onPress: () => router.push("/(auth)/login") }],
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create account";
      setError(message);
    } finally {
      setLoading("idle");
    }
  }

  async function handleGoogleSignup() {
    setError(null);
    setLoading("google");
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type !== "success" || !response.data.idToken) {
        throw new Error("Google sign-in was cancelled or returned no token");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.data.idToken,
      });
      if (error) throw error;

      router.replace("/(tabs)");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      Alert.alert("Google signup failed", message);
    } finally {
      setLoading("idle");
    }
  }

  async function handleConnectWallet() {
    setError(null);
    setLoading("wallet");
    try {
      await connect();
      router.replace("/(tabs)");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not connect wallet";
      Alert.alert("Wallet connection failed", message);
    } finally {
      setLoading("idle");
    }
  }

  const emailLoading = loading === "email";
  const anyLoading = loading !== "idle";

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            paddingHorizontal: 32,
            paddingTop: 16,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <BackButton />

            <View className={styles.brandRow}>
              <Text className={styles.brandText}>AfriLoom</Text>
              <View className={styles.brandDot} />
            </View>

            <View className={styles.headlineWrap}>
              <Text className={styles.headline}>Create your account</Text>
              <Text className={styles.subhead}>
                Sign up with email, Google, or your Solana wallet.
              </Text>
            </View>

            {error && (
              <Text
                className={styles.errorText}
                accessibilityLiveRegion="polite"
              >
                {error}
              </Text>
            )}

            {/* Email + password fields */}
            <View className={styles.fieldGroup}>
              <View>
                <Text className={styles.label}>Email</Text>
                <TextInput
                  className={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!anyLoading}
                />
              </View>

              <View>
                <Text className={styles.label}>Password</Text>
                <View className={styles.passwordWrap}>
                  <TextInput
                    className={`${styles.input} pr-12`}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="At least 6 characters"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    editable={!anyLoading}
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    className={styles.eyeButton}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#94a3b8"
                    />
                  </Pressable>
                </View>
              </View>

              <View>
                <Text className={styles.label}>Confirm password</Text>
                <View className={styles.passwordWrap}>
                  <TextInput
                    className={`${styles.input} pr-12`}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    editable={!anyLoading}
                    onSubmitEditing={handleEmailSignup}
                  />
                  <Pressable
                    onPress={() => setShowConfirm((v) => !v)}
                    className={styles.eyeButton}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showConfirm ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#94a3b8"
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            <Pressable
              onPress={handleEmailSignup}
              disabled={anyLoading}
              accessibilityRole="button"
              accessibilityLabel="Create account with email"
              className={`${styles.emailButton} ${
                anyLoading && !emailLoading ? "opacity-40" : ""
              }`}
            >
              {emailLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className={styles.emailButtonText}>Create account</Text>
              )}
            </Pressable>

            <View className={styles.buttonGroup}>
              <View className={styles.dividerRow}>
                <View className={styles.dividerLine} />
                <Text className={styles.dividerLabel}>OR</Text>
                <View className={styles.dividerLine} />
              </View>

              <SocialAuthButtons
                onGooglePress={handleGoogleSignup}
                loading={loading === "google"}
                disabled={anyLoading}
              />

              <Pressable
                onPress={handleConnectWallet}
                disabled={anyLoading}
                className={`${styles.walletButton} ${
                  anyLoading && loading !== "wallet" ? "opacity-40" : ""
                }`}
              >
                {loading === "wallet" ? (
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
            <Text className={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className={styles.footerLink}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
