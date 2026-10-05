import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type User = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
};

type Props = {
  user: User;
  onPress?: () => void;
};

export default function UserInfo({ user, onPress }: Props) {
  const displayName = user.full_name || user.email || "User";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between px-5 mb-5"
    >
      <View className="flex-row items-center gap-3">
        <View className="w-14 h-14 rounded-full bg-green-100 items-center justify-center">
          <FontAwesome name="user" size={28} color="#16a34a" />
        </View>

        <View>
          <Text className="text-lg font-bold text-slate-900">
            {displayName}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Text className="text-sm text-slate-400">Email</Text>
            <Text className="text-slate-900 text-xs font-semibold ml-2">
              {user.email || "Not set"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onPress} hitSlop={10}>
        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
