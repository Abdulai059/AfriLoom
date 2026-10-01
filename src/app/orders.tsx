import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Temporary mock orders — replace with real data later
const MOCK_ORDERS = [
  {
    id: "ord_1",
    productId: "1",
    title: "Handwoven Kente Scarf",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200",
    creator: "Ama Mensah",
    price: 45,
    currency: "USDC",
    status: "confirmed",
    date: "2026-09-28",
  },
  {
    id: "ord_2",
    productId: "2",
    title: "Beaded Maasai Necklace",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200",
    creator: "Joseph Nyerere",
    price: 32,
    currency: "SOL",
    status: "shipped",
    date: "2026-09-20",
  },
  {
    id: "ord_3",
    productId: "3",
    title: "Clay Pottery Bowl Set",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=200",
    creator: "Fatima Diallo",
    price: 60,
    currency: "SKR",
    status: "delivered",
    date: "2026-09-10",
  },
];

type Status = "confirmed" | "shipped" | "delivered" | "cancelled";

const STATUS_STYLE: Record<
  Status,
  { label: string; bg: string; text: string }
> = {
  confirmed: { label: "Confirmed", bg: "bg-blue-50", text: "text-blue-600" },
  shipped: { label: "Shipped", bg: "bg-amber-50", text: "text-amber-600" },
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  cancelled: { label: "Cancelled", bg: "bg-slate-100", text: "text-slate-500" },
};

const FILTERS = ["All", "Confirmed", "Shipped", "Delivered"] as const;

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered =
    filter === "All"
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter(
          (o) => o.status.toLowerCase() === filter.toLowerCase(),
        );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
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
          My Orders
        </Text>
      </View>

      {/* Filters */}
      <View className="px-4 pt-4 pb-2">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const active = filter === item;
            return (
              <Pressable
                onPress={() => setFilter(item)}
                className={`px-4 py-2 rounded-full ${
                  active ? "bg-slate-900" : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    active ? "text-white" : "text-slate-600"
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Order list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 24,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
              <Ionicons name="receipt-outline" size={28} color="#94a3b8" />
            </View>
            <Text className="text-base font-semibold text-slate-700">
              No orders yet
            </Text>
            <Text className="text-sm text-slate-400 mt-1 text-center">
              Your purchases will show up here
            </Text>
            <Pressable
              onPress={() => router.replace("/")}
              className="mt-5 px-5 py-2.5 bg-slate-900 rounded-full"
            >
              <Text className="text-white font-semibold text-sm">
                Browse products
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const status = STATUS_STYLE[item.status as Status];

          return (
            <Pressable
              onPress={() => router.push(`/product/${item.productId}`)}
              className="flex-row bg-slate-50 rounded-2xl p-3.5 mb-3 active:opacity-90"
            >
              <Image
                source={{ uri: item.image }}
                className="w-18 h-18 rounded-xl bg-white"
                style={{ width: 72, height: 72 }}
                resizeMode="cover"
              />

              <View className="flex-1 ml-3 justify-center">
                <View className="flex-row items-start justify-between">
                  <Text
                    className="text-[15px] font-bold text-slate-900 flex-1 mr-2"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <View className={`px-2 py-0.5 rounded-full ${status.bg}`}>
                    <Text className={`text-[10px] font-bold ${status.text}`}>
                      {status.label}
                    </Text>
                  </View>
                </View>

                <Text className="text-xs text-slate-500 mt-1">
                  by {item.creator}
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-sm font-bold text-slate-900">
                    {item.price} {item.currency}
                  </Text>
                  <Text className="text-[11px] text-slate-400">
                    {formatDate(item.date)}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
