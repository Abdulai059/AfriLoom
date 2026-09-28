import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
};

export default function SectionHeader({ title, onPress }: Props) {
  return (
    <View className="flex-row justify-between items-center mb-3.5">
      <Text className="text-lg font-bold text-slate-900">{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text className="text-sm font-semibold text-green-500">See all</Text>
      </TouchableOpacity>
    </View>
  );
}


