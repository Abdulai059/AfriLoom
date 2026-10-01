// components/SocialAuthButtons.tsx
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { GoogleIcon } from "./ui/GoogleIcon";


type Props = {
  onGooglePress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function SocialAuthButtons({ onGooglePress, loading, disabled }: Props) {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onGooglePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`h-14 flex-row items-center justify-center rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 active:opacity-80 ${
        disabled && !loading ? "opacity-40" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#0f172a" />
      ) : (
        <>
          <GoogleIcon size={20} />
          <Text className="ml-3 text-base font-semibold text-slate-900 dark:text-white">
            Continue with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
