import { Row } from "@/components/ui/Row";
import { useCreatorWalletForCurrency } from "@/hooks/useCreatorWallets";
import { useProduct } from "@/hooks/useProducts";
import {
  buildSkrPaymentInstructions,
  buildSolPaymentInstruction,
  buildUsdcPaymentInstructions,
} from "@/lib/payments";
import { Ionicons } from "@expo/vector-icons";
import { getAddMemoInstruction } from "@solana-program/memo";
import { useQuery } from "@tanstack/react-query";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CURRENCIES = [
  {
    id: "usdc",
    label: "USDC",
    subtitle: "USD Coin",
    icon: "logo-usd",
    color: "bg-blue-500",
  },
  {
    id: "sol",
    label: "SOL",
    subtitle: "Solana",
    icon: "planet",
    color: "bg-purple-500",
  },
  {
    id: "skr",
    label: "SKR",
    subtitle: "AfriLoom Token",
    icon: "flash",
    color: "bg-rose-500",
  },
] as const;

type CurrencyId = (typeof CURRENCIES)[number]["id"];

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyId>("usdc");
  const [isPaying, setIsPaying] = useState(false);

  const { data: product, isLoading, isError } = useProduct(id!);

  const { account, sendTransactions, getTransactionSigner, client } =
    useMobileWallet();

  // Needed by getTransactionSigner as minContextSlot
  const { data: currentSlot } = useQuery({
    queryKey: ["current-slot"],
    queryFn: () => client.rpc.getSlot().send(),
    enabled: !!account,
  });

  const payerSigner =
    account && currentSlot !== undefined
      ? getTransactionSigner(account.address, currentSlot)
      : undefined;

  const { data: merchantWallet } = useCreatorWalletForCurrency(
    product?.creator_id,
    selectedCurrency,
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#59c51f" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-500">Product not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-5 py-2.5 bg-slate-900 rounded-full"
        >
          <Text className="text-white font-semibold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handlePay = async () => {
    if (!account || !payerSigner) {
      Alert.alert(
        "Connect your wallet first",
        "Go to the Wallet tab to connect.",
      );
      return;
    }

    if (!merchantWallet) {
      Alert.alert(
        "Payment unavailable",
        `This creator hasn't set up ${selectedCurrency.toUpperCase()} payouts yet.`,
      );
      return;
    }

    setIsPaying(true);

    try {
      const memoIx = getAddMemoInstruction({
        memo: `AfriLoom order ${product.id}`,
      });

      let instructions;

      if (selectedCurrency === "sol") {
        instructions = [
          buildSolPaymentInstruction(
            payerSigner,
            merchantWallet,
            product.price,
          ),
          memoIx,
        ];
      } else if (selectedCurrency === "usdc") {
        const ixs = await buildUsdcPaymentInstructions(
          payerSigner,
          merchantWallet,
          product.price,
        );
        instructions = [...ixs, memoIx];
      } else {
        const ixs = await buildSkrPaymentInstructions(
          payerSigner,
          merchantWallet,
          product.price,
        );
        instructions = [...ixs, memoIx];
      }

      console.log("payerSigner:", payerSigner);
      console.log("merchantWallet:", merchantWallet);
      console.log("instructions:", instructions);

      const signature = await sendTransactions(instructions);
      console.log("Got signature:", signature);

      router.replace({
        pathname: "/product/payment-success",
        params: {
          productId: product.id,
          currency: selectedCurrency,
          amount: String(product.price),
          signature,
        },
      });
    } catch (err) {
      console.log("Payment failed", err);
      Alert.alert(
        "Payment failed",
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View
        className="flex-row items-center px-4 pb-3 border-b border-slate-100"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-bold text-slate-900 mr-10">
          Checkout
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        className="px-5"
      >
        <Text className="text-sm font-semibold text-slate-400 mt-5 mb-3 uppercase tracking-wide">
          Order Summary
        </Text>

        <View className="flex-row bg-slate-50 rounded-2xl p-4">
          <Image
            source={{ uri: product.images?.[0] }}
            className="w-20 h-20 rounded-xl bg-white"
            resizeMode="cover"
          />
          <View className="flex-1 ml-3.5 justify-center">
            <Text
              className="text-base font-bold text-slate-900"
              numberOfLines={2}
            >
              {product.title}
            </Text>
            <Text className="text-xs text-slate-500 mt-1">
              by {product.creators?.creator_name ?? "Creator"}
            </Text>
            <Text className="text-sm font-bold text-emerald-600 mt-2">
              {product.price} {product.currency}
            </Text>
          </View>
        </View>

        <Text className="text-sm font-semibold text-slate-400 mt-8 mb-3 uppercase tracking-wide">
          Pay with
        </Text>

        <View className="gap-2.5">
          {CURRENCIES.map((currency) => {
            const isSelected = selectedCurrency === currency.id;
            const isSkrDisabled = currency.id === "skr" && !product.accepts_skr;

            return (
              <Pressable
                key={currency.id}
                disabled={isSkrDisabled}
                onPress={() => setSelectedCurrency(currency.id)}
                className={`flex-row items-center p-4 rounded-2xl border-2 ${
                  isSelected
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-100 bg-white"
                } ${isSkrDisabled ? "opacity-40" : ""}`}
              >
                <View
                  className={`w-10 h-10 rounded-full ${currency.color} items-center justify-center`}
                >
                  <Ionicons
                    name={currency.icon as any}
                    size={20}
                    color="white"
                  />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-bold text-slate-900">
                    {currency.label}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {isSkrDisabled
                      ? "Not accepted for this product"
                      : currency.subtitle}
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    isSelected
                      ? "border-slate-900 bg-slate-900"
                      : "border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-sm font-semibold text-slate-400 mt-8 mb-3 uppercase tracking-wide">
          Breakdown
        </Text>

        <View className="bg-slate-50 rounded-2xl p-4 gap-3">
          <Row
            label="Subtotal"
            value={`${product.price} ${product.currency}`}
          />
          <Row label="Network fee" value="~0.001 SOL" muted />
          {selectedCurrency === "skr" && (
            <Row label="SKR cashback" value="+2% back" highlight />
          )}
          <View className="h-px bg-slate-200 my-1" />
          <Row
            label="Total"
            value={`${product.price} ${selectedCurrency.toUpperCase()}`}
            bold
          />
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={handlePay}
          disabled={isPaying}
          className={`py-4 rounded-2xl items-center ${isPaying ? "bg-slate-400" : "bg-slate-900 active:opacity-90"}`}
        >
          <Text className="text-white font-bold text-base">
            {isPaying
              ? "Processing..."
              : `Pay ${product.price} ${selectedCurrency.toUpperCase()}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
