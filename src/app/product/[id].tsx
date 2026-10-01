import { useProduct } from "@/hooks/useProducts";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const { data: product, isLoading, isError } = useProduct(id!);

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
        <Text className="text-slate-500 text-base">Product not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-5 py-2.5 bg-slate-900 rounded-full"
        >
          <Text className="text-white font-semibold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const images = product.images?.length ? product.images : [];
  const creator = product.creators;

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Image Gallery ── */}
        <View className="relative bg-slate-50">
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImage(index);
            }}
          >
            {images.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={{ width, height: width * 0.95 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/90 items-center justify-center"
            style={{ top: insets.top + 8 }}
          >
            <Ionicons name="arrow-back" size={22} color="#0f172a" />
          </Pressable>

          {images.length > 1 && (
            <View className="absolute bottom-4 self-center flex-row gap-1.5">
              {images.map((imageUri, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={{ width, height: width * 0.95 }}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </View>

        {/* ── Content ── */}
        <View className="px-5 pt-5">
          {product.accepts_skr && (
            <View className="self-start bg-rose-100 px-2.5 py-1 rounded-full mb-3">
              <Text className="text-rose-600 text-[11px] font-bold">
                Accepts SKR
              </Text>
            </View>
          )}

          <Text className="text-2xl font-bold text-slate-900 leading-7">
            {product.title}
          </Text>

          <Text className="text-xl font-bold text-emerald-600 mt-2">
            {product.price} {product.currency}
          </Text>

          <Pressable
            onPress={() => router.push(`/creator/${product.creator_id}`)}
            className="flex-row items-center mt-5 p-3.5 bg-slate-50 rounded-2xl active:opacity-80"
          >
            <View className="w-11 h-11 rounded-full bg-amber-100 items-center justify-center mr-3">
              {creator?.profile_image ? (
                <Image
                  source={{ uri: creator.profile_image }}
                  className="w-11 h-11 rounded-full"
                />
              ) : (
                <Text className="text-lg font-bold text-amber-700">
                  {creator?.creator_name?.[0] ?? "C"}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-900">
                {creator?.creator_name ?? "Unknown Creator"}
              </Text>
              <Text className="text-xs text-slate-500 mt-0.5">
                {product.country_of_origin} · View Passport
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </Pressable>

          <View className="mt-7">
            <Text className="text-base font-bold text-slate-900 mb-2">
              Product Story
            </Text>
            <Text className="text-[15px] leading-6 text-slate-600">
              {product.product_story ??
                product.description ??
                "No story available for this product yet."}
            </Text>
          </View>

          <View className="mt-7 gap-3">
            <DetailRow label="Category" value={product.category} />
            <DetailRow label="Origin" value={product.country_of_origin} />
            {product.materials && (
              <DetailRow label="Materials" value={product.materials} />
            )}
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-xs text-slate-400">Total</Text>
            <Text className="text-lg font-bold text-slate-900">
              {product.price} {product.currency}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push(`/checkout/${product.id}`)}
            className="flex-[1.4] bg-slate-900 py-4 rounded-2xl items-center active:opacity-90"
          >
            <Text className="text-white font-bold text-base">Buy Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View className="flex-row justify-between py-2 border-b border-slate-100">
      <Text className="text-sm text-slate-400">{label}</Text>
      <Text className="text-sm font-medium text-slate-800">{value}</Text>
    </View>
  );
}
