import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function PaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Payment for product: {id}</Text>
    </View>
  );
}
