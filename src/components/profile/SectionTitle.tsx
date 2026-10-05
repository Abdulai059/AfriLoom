import { Text } from "react-native";

export default function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-sm text-slate-400 font-medium mt-5 mb-1">
      {title}
    </Text>
  );
}
