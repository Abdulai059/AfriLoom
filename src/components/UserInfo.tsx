import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  user: {
    firstName: string;
    lastName: string;
    roles: string[];
  };
  onPress?: () => void;
};

export default function UserInfo({ user, onPress }: Props) {
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
          <Text className="text-lg font-bold uppercase text-slate-900">
            {user.firstName} {user.lastName}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Text className="text-sm text-slate-400">Role</Text>
            <Text className="text-slate-900 text-xs font-semibold ml-2">
              {user.roles.join(", ")}
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
