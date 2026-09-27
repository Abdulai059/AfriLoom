import { Ionicons } from "@expo/vector-icons";
import { getAddMemoInstruction } from "@solana-program/memo";
import { useQuery } from "@tanstack/react-query";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";

export default function Wallet() {
  const { account, connect, disconnect, client, chain, sendTransactions } =
    useMobileWallet();
  const [busy, setBusy] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const balance = useQuery({
    queryKey: ["get-balance", chain, account?.address],
    enabled: !!account,
    queryFn: async () => {
      const { value } = await client.rpc.getBalance(account!.address).send();
      return Number(value) / 1e9;
    },
  });

  async function onConnect() {
    setError(null);
    try {
      await connect();
    } catch (e) {
      console.log("connect failed", e);
      setError(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
    }
  }

  async function onSendMemo() {
    setBusy(true);
    setError(null);
    try {
      const sig = await sendTransactions([
        getAddMemoInstruction({ memo: "Hello from AfriLoom" }),
      ]);
      setSignature(sig);
      balance.refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setBusy(false);
    }
  }

  const address = account ? String(account.address) : "";
  const short = address ? `${address.slice(0, 4)}…${address.slice(-4)}` : "";

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <View className="px-6 pt-14 pb-6">
        <Text className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Wallet
        </Text>
        <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {account ? "Connected to Solana" : "Connect to get started"}
        </Text>
      </View>

      {/* Main content */}
      <View className="flex-1 px-6">
        {account ? (
          <View className="gap-6">
            {/* Balance card */}
            <View className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:shadow-none border border-slate-100 dark:border-slate-800">
              <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Balance
              </Text>
              <Text className="mt-1 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {balance.isLoading ? "—" : `${(balance.data ?? 0).toFixed(3)}`}
                <Text className="text-xl font-semibold text-slate-400 dark:text-slate-500">
                  {" "}
                  SOL
                </Text>
              </Text>

              {/* Address pill */}
              <View className="mt-5 self-start rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <Text className="font-mono text-xs text-slate-600 dark:text-slate-300">
                  {short}
                </Text>
              </View>
            </View>

            {/* SKR Mint Card */}
            <View className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <Text className="text-[11px] font-semibold tracking-widest text-slate-400">
                SKR MINT
              </Text>
              <Text
                className="mt-1.5 font-mono text-[12px] leading-4 text-slate-700 dark:text-slate-300"
                numberOfLines={1}
              >
                SKRsolanaMob1eEcosys7emToKen
              </Text>
              <Text className="mt-2.5 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                Pay with SKR at checkout. First sale for a maker credits 8 SKR
                to their passport.
              </Text>
            </View>

            {/* Orders */}
            <View>
              <Text className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                Orders
              </Text>
              <View className="items-center rounded-2xl border border-dashed border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
                <Text className="text-sm text-slate-400">
                  No purchases yet.
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View className="gap-3">
              {signature && (
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
                    )
                  }
                  className="h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                >
                  <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    View on Explorer
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => disconnect()}
                className="h-14 items-center justify-center rounded-2xl bg-[#59c51f] active:opacity-90"
              >
                <Text className="text-base font-semibold text-white">
                  Disconnect
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center px-2">
            {/* Icon */}
            <View className="mb-8 h-24 w-24 items-center justify-center rounded-full bg-[#59c51f]/15 dark:bg-[#59c51f]/20">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#59c51f]/25 dark:bg-[#59c51f]/30">
                <Ionicons name="wallet-outline" size={32} color="#59c51f" />
              </View>
            </View>

            {/* Text */}
            <View className="mb-10 items-center gap-2.5">
              <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                No wallet connected
              </Text>
              <Text className="max-w-[280px] text-center text-[15px] leading-6 text-slate-500 dark:text-slate-400">
                Connect your Solana wallet to view your balance and start using
                AfriLoom.
              </Text>
            </View>

            {/* Button */}
            <Pressable
              onPress={onConnect}
              className="h-14 w-full items-center justify-center rounded-2xl bg-[#59c51f] active:opacity-90 shadow-sm shadow-[#59c51f]/40"
            >
              <Text className="text-base font-semibold text-white">
                Connect Wallet
              </Text>
            </Pressable>
          </View>
        )}

        {/* Error */}
        {error && (
          <View className="mt-6 rounded-2xl bg-red-50 px-4 py-3 dark:bg-red-950/40">
            <Text className="text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
