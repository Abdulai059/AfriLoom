import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createSolanaDevnet,
  MobileWalletProvider,
  type AppIdentity,
} from "@wallet-ui/react-native-kit";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Kept outside the component so they aren't recreated on every render
const cluster = createSolanaDevnet();
const identity: AppIdentity = { name: "AfriLoom", uri: "afriloom://app" };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MobileWalletProvider cluster={cluster} identity={identity}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#0f172a" : "#ffffff",
            },
            headerTintColor: colorScheme === "dark" ? "#f8fafc" : "#0f172a",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#0f172a" : "#f8fafc",
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "#f8fafc",
              },
            }}
          />

          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "#f8fafc",
              },
            }}
          />
        </Stack>
      </MobileWalletProvider>
    </QueryClientProvider>
  );
}
