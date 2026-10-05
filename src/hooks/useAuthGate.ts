// hooks/useAuthGate.ts
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

export function useAuthGate() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // Load session + subscribe
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      SplashScreen.hideAsync();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Redirect based on session + current route group
  useEffect(() => {
    if (!ready) return;

    const first = segments[0] as string | undefined;
    if (!first) return;

    const inAuthGroup = first === "(auth)";

    if (session && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [session, segments, ready, router]);

  return { session, ready };
}
