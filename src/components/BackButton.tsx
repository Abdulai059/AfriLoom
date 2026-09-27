// components/BackButton.tsx
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

type BackButtonProps = {
  onPress?: () => void;
  className?: string;
};

export function BackButton({ onPress, className }: BackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      className={`mb-4 -ml-2 p-2 self-start ${className ?? ""}`}
    >
      <Text className="text-slate-600 text-xl font-bold">←</Text>
    </TouchableOpacity>
  );
}
