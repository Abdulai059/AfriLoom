// hooks/useLogin.ts
import { supabase } from "@/lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useRouter } from "expo-router";
import { useState } from "react";

type AuthLoadingState = "idle" | "email" | "google" | "wallet";

async function upsertUserProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any>;
}) {
  const { error } = await supabase.from("users").upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
  });
  if (error) console.log("Failed to upsert user profile", error);
}

export function useLogin() {
  const router = useRouter();
  const { connect } = useMobileWallet();

  const [loading, setLoading] = useState<AuthLoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function loginWithEmail() {
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading("email");
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
      if (signInError) throw signInError;
      if (data.user) await upsertUserProfile(data.user);
      router.replace("/(tabs)");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password",
      );
    } finally {
      setLoading("idle");
    }
  }

  async function loginWithGoogle() {
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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading("idle");
    }
  }

  async function loginWithWallet() {
    setError(null);
    setLoading("wallet");
    try {
      await connect();
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) throw signInError;
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect wallet");
    } finally {
      setLoading("idle");
    }
  }

  return {
    // form
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    // state
    error,
    loading,
    emailLoading: loading === "email",
    googleLoading: loading === "google",
    walletLoading: loading === "wallet",
    anyLoading: loading !== "idle",
    // actions
    loginWithEmail,
    loginWithGoogle,
    loginWithWallet,
    goToSignup: () => router.push("/(auth)/signup"),
  };
}
