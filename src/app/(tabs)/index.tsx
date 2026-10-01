import CategoryList from "@/components/CategoryList";
import HomeHeader from "@/components/HomeHeader";
import ProductGrid from "@/components/ProductScreen";
import PromoBanner from "@/components/PromoBanner";
import SectionHeader from "@/components/SectionHeader";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader />
      <PromoBanner
        title="First Purchase Bonus"
        subtitle="Welcome to AfriLoom"
        bigText="Get 5% SKR"
        buttonText="Shop Now"
        imageSource={require("../../../assets/materials/basket.png")}
      />
      <SectionHeader title="Categories" />
      <CategoryList />

      <SectionHeader title="Featured Products" />
      <ProductGrid />
    </ScrollView>
  );
}
