import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  title?: string;
}

export default function ProfileHeader({ title = "Profile" }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white border-b border-slate-50"
      style={{
        paddingTop: insets.top + 6,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center justify-between px-4 pb-3.5 h-14">
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </Pressable>

        {/* Centered title */}
        <Text className="absolute left-0 right-0 text-center text-[17px] font-semibold text-slate-900 tracking-tight">
          {title}
        </Text>

        {/* Right spacer */}
        <View className="w-10" />
      </View>
    </View>
  );
}
