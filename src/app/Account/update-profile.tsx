// app/(app)/update-profile.tsx
import ProfileHeader from "@/components/profile/ProfileHeader";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

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
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
        bio: profile?.bio || "",
        avatar_url: profile?.avatar_url || null,
      };
    },
  });

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setPhone(user.phone);
      setBio(user.bio);
    }
  }, [user]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("No user");

      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
        })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.back();
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ProfileHeader title="Edit Profile" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar (default only) */}
          <View className="items-center mt-8 mb-8">
            <View className="w-28 h-28 rounded-full bg-slate-200 overflow-hidden items-center justify-center">
              {user?.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={48} color="#94a3b8" />
              )}
            </View>
          </View>

          {/* Form */}
          <View className="px-5 gap-5">
            {/* Full Name */}
            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#94a3b8"
                className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900"
              />
            </View>

            {/* Email (read-only) */}
            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Email
              </Text>
              <View className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5">
                <Text className="text-base text-slate-500">{user?.email}</Text>
              </View>
            </View>

            {/* Phone */}
            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+234 800 000 0000"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900"
              />
            </View>

            {/* Bio */}
            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Bio
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us a bit about yourself..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 min-h-[110px]"
              />
            </View>

            {/* Save Button */}
            <Pressable
              onPress={() => updateProfile()}
              disabled={isPending || !fullName.trim()}
              className={`mt-4 rounded-xl py-4 items-center ${
                isPending || !fullName.trim()
                  ? "bg-slate-300"
                  : "bg-slate-900 active:bg-slate-800"
              }`}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Save Changes
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
