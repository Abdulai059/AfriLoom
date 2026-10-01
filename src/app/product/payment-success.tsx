import { productsData } from "@/assets/data";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { productId, currency, amount } = useLocalSearchParams<{
    productId: string;
    currency: string;
    amount: string;
  }>();

  const product = productsData.products.find((p) => p.id === productId);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isSkr = currency === "skr";

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center px-8">
        {/* Success checkmark */}
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center mb-6"
        >
          <View className="w-16 h-16 rounded-full bg-emerald-500 items-center justify-center">
            <Ionicons name="checkmark" size={36} color="white" />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }} className="items-center">
          <Text className="text-2xl font-bold text-slate-900 text-center">
            Payment Successful!
          </Text>

          <Text className="text-base text-slate-500 text-center mt-2 leading-6">
            You paid{" "}
            <Text className="font-bold text-slate-800">
              {amount} {currency?.toUpperCase()}
            </Text>
            {product ? (
              <>
                {" "}
                for{" "}
                <Text className="font-bold text-slate-800">
                  {product.title}
                </Text>
              </>
            ) : null}
          </Text>

          {/* SKR cashback banner */}
          {isSkr && (
            <View className="mt-6 w-full bg-rose-50 border border-rose-100 rounded-2xl p-4 flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-rose-500 items-center justify-center mr-3">
                <Ionicons name="flash" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-rose-700">
                  SKR Cashback Earned
                </Text>
                <Text className="text-xs text-rose-500 mt-0.5">
                  +2% back has been added to your wallet
                </Text>
              </View>
            </View>
          )}

          {/* Order details card */}
          <View className="mt-6 w-full bg-slate-50 rounded-2xl p-4 gap-3">
            <DetailRow
              label="Amount"
              value={`${amount} ${currency?.toUpperCase()}`}
            />
            <DetailRow label="Product" value={product?.title ?? "—"} />
            <DetailRow
              label="Creator"
              value={product?.creator?.creator_name ?? "—"}
            />
            <DetailRow label="Status" value="Confirmed" highlight />
          </View>
        </Animated.View>
      </View>

      {/* Bottom actions */}
      <View
        className="px-5 gap-3"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={() => router.replace("/")}
          className="bg-slate-900 py-4 rounded-2xl items-center active:opacity-90"
        >
          <Text className="text-white font-bold text-base">Back to Home</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/orders")}
          className="py-3.5 rounded-2xl items-center border border-slate-200 active:bg-slate-50"
        >
          <Text className="text-slate-700 font-semibold text-base">
            View My Orders
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-sm text-slate-400">{label}</Text>
      <Text
        className={`text-sm font-medium ${
          highlight ? "text-emerald-600" : "text-slate-800"
        }`}
        numberOfLines={1}
        style={{ maxWidth: "60%", textAlign: "right" }}
      >
        {value}
      </Text>
    </View>
  );
}
