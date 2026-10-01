import { Text, View } from "react-native";

export function Row({
  label,
  value,
  muted,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <View className="flex-row justify-between items-center">
      <Text
        className={`text-sm ${bold ? "font-bold text-slate-900" : "text-slate-500"}`}
      >
        {label}
      </Text>
      <Text
        className={`text-sm ${
          highlight
            ? "font-semibold text-emerald-600"
            : bold
              ? "font-bold text-slate-900"
              : muted
                ? "text-slate-400"
                : "font-medium text-slate-800"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}
