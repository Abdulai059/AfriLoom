// app/(app)/change-password.tsx
import ProfileHeader from "@/components/profile/ProfileHeader";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChangePassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: async () => {
      setError("");

      if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Supabase doesn't require current password for updateUser,
      // but for better security you can re-authenticate first if needed.
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      router.back();
    },
    onError: (err: any) => {
      setError(err.message || "Failed to update password");
    },
  });

  const isValid =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    confirmPassword.length >= 6 &&
    newPassword === confirmPassword;

  return (
    <View className="flex-1 bg-slate-50">
      <ProfileHeader title="Change Password" />

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
          <View className="px-5 pt-8 gap-5">
            {/* Current Password */}
            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Current Password
              </Text>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4">
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showCurrent}
                  className="flex-1 py-3.5 text-base text-slate-900"
                />
                <Pressable
                  onPress={() => setShowCurrent(!showCurrent)}
                  hitSlop={10}
                >
                  <Ionicons
                    name={showCurrent ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#64748b"
                  />
                </Pressable>
              </View>
            </View>

            {/* New Password */}
            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2">
                New Password
              </Text>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4">
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showNew}
                  className="flex-1 py-3.5 text-base text-slate-900"
                />
                <Pressable onPress={() => setShowNew(!showNew)} hitSlop={10}>
                  <Ionicons
                    name={showNew ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#64748b"
                  />
                </Pressable>
              </View>
              <Text className="text-xs text-slate-500 mt-1.5">
                Must be at least 6 characters
              </Text>
            </View>

            {/* Confirm Password */}
            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Confirm New Password
              </Text>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showConfirm}
                  className="flex-1 py-3.5 text-base text-slate-900"
                />
                <Pressable
                  onPress={() => setShowConfirm(!showConfirm)}
                  hitSlop={10}
                >
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#64748b"
                  />
                </Pressable>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <Pressable
              onPress={() => changePassword()}
              disabled={!isValid || isPending}
              className={`mt-4 rounded-xl py-4 items-center ${
                !isValid || isPending
                  ? "bg-slate-300"
                  : "bg-slate-900 active:bg-slate-800"
              }`}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Update Password
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
