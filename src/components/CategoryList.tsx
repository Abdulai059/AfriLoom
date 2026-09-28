// components/ProductList.tsx
import { Image, Pressable, ScrollView, Text, View } from "react-native";

type Category = {
  key: string;
  label: string;
  image: any;
  bg: string;
};

const categories: Category[] = [
  {
    key: "FASHION",
    label: "Fashion",
    image: require("../../assets/categories/fashion.png"),
    bg: "bg-rose-100",
  },
  {
    key: "CRAFTS",
    label: "Crafts",
    image: require("../../assets/categories/craft.png"),
    bg: "bg-amber-100",
  },
  {
    key: "ART",
    label: "Art",
    image: require("../../assets/categories/art.png"),
    bg: "bg-indigo-100",
  },
  {
    key: "JEWELRY",
    label: "Jewelry",
    image: require("../../assets/categories/jewelry.png"),
    bg: "bg-orange-100",
  },
  {
    key: "CULTURE",
    label: "Culture",
    image: require("../../assets/categories/culture.png"),
    bg: "bg-emerald-100",
  },
];

type Props = {
  onSelect?: (key: string) => void;
};

export default function CategoryList({ onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
    >
      {categories.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onSelect?.(item.key)}
          className="items-center w-[72px]"
        >
          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-2 overflow-hidden ${item.bg} shadow-sm`}
          >
            <Image
              source={item.image}
              className="w-11 h-11"
              resizeMode="contain"
            />
          </View>

          <Text className="text-xs font-semibold text-slate-700 dark:text-slate-900 text-center leading-tight">
            {item.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
