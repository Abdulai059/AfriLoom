import { ScrollView, Text, View } from "react-native";

export default function Discover() {
  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-semibold">Discover</Text>
      </View>
    </ScrollView>
  );
}
