// app/_layout.tsx
import { useAuthGate } from "@/hooks/useAuthGate";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createSolanaDevnet,
  MobileWalletProvider,
  type AppIdentity,
} from "@wallet-ui/react-native-kit";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const cluster = createSolanaDevnet();
const identity: AppIdentity = { name: "AfriLoom", uri: "afriloom://app" };
const BACKGROUND = "#f8fafc";

export default function RootLayout() {
  const { ready } = useAuthGate();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BACKGROUND,
        }}
      >
        <ActivityIndicator color="#59c51f" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MobileWalletProvider cluster={cluster} identity={identity}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: BACKGROUND },
          }}
        />
      </MobileWalletProvider>
    </QueryClientProvider>
  );
}
