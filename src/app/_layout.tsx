// app/_layout.tsx
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

import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Kept outside the component so they aren't recreated on every render
const cluster = createSolanaDevnet();
const identity: AppIdentity = { name: "AfriLoom", uri: "afriloom://app" };

const BACKGROUND = "#f8fafc";

export default function RootLayout() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MobileWalletProvider cluster={cluster} identity={identity}>
        {/* Dark icons on a light background */}
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
