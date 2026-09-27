// components/SocialAuthButtons.tsx
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type Props = {
  onGooglePress: () => void;
  loading?: boolean;
};

export function SocialAuthButtons({ onGooglePress, loading }: Props) {
  return (
    <TouchableOpacity
      onPress={onGooglePress}
      disabled={loading}
      className="h-14 flex-row items-center justify-center rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 active:opacity-80"
    >
      {loading ? (
        <ActivityIndicator color="#0f172a" />
      ) : (
        <>
          <FontAwesome name="google" size={20} color="#DB4437" />
          <Text className="ml-3 text-base font-semibold text-slate-900 dark:text-white">
            Continue with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
