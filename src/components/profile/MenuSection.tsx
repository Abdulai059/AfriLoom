// components/profile/MenuSection.tsx
import { View } from "react-native";
import SectionTitle from "./SectionTitle";
import MenuItem from "./MenuItem";
import { useRouter } from "expo-router";

type MenuItemType = {
  icon: React.ReactNode;
  title: string;
  route?: string;
};

type Props = {
  title: string;
  items: MenuItemType[];
};

export default function MenuSection({ title, items }: Props) {
  const router = useRouter();

  return (
    <View>
      <SectionTitle title={title} />
      {items.map((item) => (
        <MenuItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          onPress={() => item.route && router.push(item.route as any)}
        />
      ))}
    </View>
  );
}
