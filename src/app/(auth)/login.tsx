// app/(auth)/login.tsx
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { useLogin } from "@/hooks/useLogin";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = {
  brandRow: "flex-row items-baseline justify-center mb-10",
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

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    emailLoading,
    googleLoading,
    walletLoading,
    anyLoading,
    loginWithEmail,
    loginWithGoogle,
    loginWithWallet,
    goToSignup,
  } = useLogin();

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
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
            paddingTop: 32,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View className={styles.brandRow}>
              <Text className={styles.brandText}>AfriLoom</Text>
              <View className={styles.brandDot} />
            </View>

            <View className={styles.headlineWrap}>
              <Text className={styles.headline}>Welcome back</Text>
              <Text className={styles.subhead}>
                Sign in with email, Google, or your Solana wallet.
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
                    placeholder="Your password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    textContentType="password"
                    editable={!anyLoading}
                    onSubmitEditing={loginWithEmail}
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
            </View>

            <Pressable
              onPress={loginWithEmail}
              disabled={anyLoading}
              accessibilityRole="button"
              accessibilityLabel="Sign in with email"
              className={`${styles.emailButton} ${
                anyLoading && !emailLoading ? "opacity-40" : ""
              }`}
            >
              {emailLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className={styles.emailButtonText}>Sign in</Text>
              )}
            </Pressable>

            <View className={styles.buttonGroup}>
              <View className={styles.dividerRow}>
                <View className={styles.dividerLine} />
                <Text className={styles.dividerLabel}>OR</Text>
                <View className={styles.dividerLine} />
              </View>

              <SocialAuthButtons
                onGooglePress={loginWithGoogle}
                loading={googleLoading}
                disabled={anyLoading}
              />

              <Pressable
                onPress={loginWithWallet}
                disabled={anyLoading}
                accessibilityRole="button"
                accessibilityLabel="Connect Solana wallet"
                accessibilityState={{
                  disabled: anyLoading,
                  busy: walletLoading,
                }}
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
            <Pressable onPress={goToSignup}>
              <Text className={styles.footerLink}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
