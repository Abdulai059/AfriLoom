import { ScrollView } from "react-native";
import UserInfo from "@/components/UserInfo";


export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <UserInfo
        user={{
          firstName: "John",
          lastName: "Doe",
          roles: ["Admin"],
        }}
      />
    </ScrollView>
  );
}
