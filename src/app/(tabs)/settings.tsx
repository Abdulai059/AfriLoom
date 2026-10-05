import LogoutButton from "@/components/profile/LogoutButton";
import { getProfileMenu, UserRole } from "@/components/profile/menuData";
import MenuSection from "@/components/profile/MenuSection";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserInfo from "@/components/profile/UserInfo";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const insets = useSafeAreaInsets();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      return {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name,
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
        role: (profile?.role as UserRole) || "buyer", // ← make sure you store role in users table
      };
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500">Loading...</Text>
      </View>
    );
  }

  const menu = getProfileMenu(user?.role || "buyer");

  return (
    <View className="flex-1 bg-slate-50">
      <ProfileHeader />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        {user && (
          <View className="px-5 pt-5">
            <UserInfo user={user} />
          </View>
        )}

        {/* Menu Sections */}
        <View className="px-5 mt-2">
          {menu.map((section) => (
            <MenuSection
              key={section.title}
              title={section.title}
              items={section.items}
            />
          ))}

          <LogoutButton />
        </View>
      </ScrollView>
    </View>
  );
}
