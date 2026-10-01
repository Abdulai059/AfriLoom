// components/ProductGrid.tsx
import { useProducts } from "@/hooks/useProducts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

const BG_COLORS = [
  "bg-sky-50",
  "bg-yellow-50",
  "bg-pink-50",
  "bg-green-50",
  "bg-purple-50",
] as const;

export default function ProductGrid() {
  const router = useRouter();
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return (
      <View className="py-10 items-center">
        <ActivityIndicator color="#59c51f" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-10 items-center">
        <Text className="text-slate-500">
          Couldn't load products
          {error instanceof Error ? `: ${error.message}` : ""}
        </Text>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View className="py-10 items-center">
        <Text className="text-slate-500">No products yet.</Text>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-3.5">
      {products.map((item, index) => (
        <Pressable
          key={item.id}
          onPress={() => router.push(`/product/${item.id}`)}
          className={`w-[48%] ${BG_COLORS[index % BG_COLORS.length]} rounded-2xl p-4 border border-gray-200 active:opacity-90`}
        >
          {item.accepts_skr && (
            <View className="absolute top-3 right-3 bg-rose-400 rounded-full px-2 py-0.5 z-10">
              <Text className="text-[10px] font-bold text-white">SKR</Text>
            </View>
          )}

          <View className="w-24 h-24 mb-3 mx-auto rounded-xl overflow-hidden items-center justify-center bg-white/40">
            <Image
              source={{ uri: item.images?.[0] }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <Text
            className="text-sm font-bold text-slate-900 mb-0.5"
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text
            className="text-xs text-slate-500 font-medium mb-2"
            numberOfLines={1}
          >
            {item.creators?.creator_name} · {item.country_of_origin}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-slate-900">
              {item.price} {item.currency}
            </Text>
            <View className="w-9 h-9 rounded-full bg-green-400 items-center justify-center">
              <Ionicons name="cart-outline" size={18} color="white" />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
