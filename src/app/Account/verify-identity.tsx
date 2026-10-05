// app/(app)/verify-identity.tsx
import ProfileHeader from "@/components/profile/ProfileHeader";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DocumentType = "id_front" | "id_back" | "selfie";

export default function VerifyIdentity() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  // Get current creator verification status
  const { data: creator, isLoading } = useQuery({
    queryKey: ["creator-verification"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("creators")
        .select("id, verification_status, rejection_reason, is_verified")
        .eq("user_id", user.id)
        .single();

      return data;
    },
  });

  const pickImage = async (type: DocumentType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === "id_front") setIdFront(uri);
      if (type === "id_back") setIdBack(uri);
      if (type === "selfie") setSelfie(uri);
    }
  };

  const uploadImage = async (uri: string, path: string) => {
    const ext = uri.split(".").pop() || "jpg";
    const fileName = `${path}.${ext}`;

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: `image/${ext}`,
    } as any);

    const { error } = await supabase.storage
      .from("verification-docs")
      .upload(fileName, formData, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from("verification-docs")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const { mutate: submitVerification, isPending } = useMutation({
    mutationFn: async () => {
      if (!creator?.id) throw new Error("Creator profile not found");
      if (!idFront || !selfie) {
        throw new Error("ID front and selfie are required");
      }

      const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
        uploadImage(idFront, `${creator.id}/id-front`),
        idBack
          ? uploadImage(idBack, `${creator.id}/id-back`)
          : Promise.resolve(null),
        uploadImage(selfie, `${creator.id}/selfie`),
      ]);

      const { error } = await supabase
        .from("creators")
        .update({
          id_document_url: idFrontUrl,
          id_document_back_url: idBackUrl,
          selfie_url: selfieUrl,
          verification_status: "pending",
          verification_submitted_at: new Date().toISOString(),
        })
        .eq("id", creator.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-verification"] });
      Alert.alert(
        "Submitted",
        "Your documents have been submitted for review. We’ll notify you once verified.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    },
    onError: (err: any) => {
      Alert.alert("Error", err.message || "Failed to submit verification");
    },
  });

  const status = creator?.verification_status || "unverified";

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ProfileHeader title="Verify Identity" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-6">
          {/* Status Banner */}
          {status === "verified" && (
            <View className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 flex-row items-center gap-3">
              <Ionicons name="checkmark-circle" size={24} color="#059669" />
              <View className="flex-1">
                <Text className="text-emerald-800 font-semibold">Verified</Text>
                <Text className="text-emerald-600 text-sm">
                  Your identity has been verified.
                </Text>
              </View>
            </View>
          )}

          {status === "pending" && (
            <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex-row items-center gap-3">
              <Ionicons name="time" size={24} color="#d97706" />
              <View className="flex-1">
                <Text className="text-amber-800 font-semibold">
                  Under Review
                </Text>
                <Text className="text-amber-600 text-sm">
                  We’re reviewing your documents. This usually takes 1–2
                  business days.
                </Text>
              </View>
            </View>
          )}

          {status === "rejected" && (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <View className="flex-row items-center gap-3 mb-1">
                <Ionicons name="close-circle" size={24} color="#dc2626" />
                <Text className="text-red-800 font-semibold">Rejected</Text>
              </View>
              <Text className="text-red-600 text-sm ml-9">
                {creator?.rejection_reason ||
                  "Please resubmit clearer documents."}
              </Text>
            </View>
          )}

          {/* Instructions */}
          {(status === "unverified" || status === "rejected") && (
            <>
              <Text className="text-base text-slate-600 mb-6 leading-6">
                To sell on Afriloom, please verify your identity. Upload a clear
                photo of your government-issued ID and a selfie.
              </Text>

              {/* ID Front */}
              <UploadCard
                title="ID / Passport (Front)"
                subtitle="National ID, Passport or Driver’s License"
                image={idFront}
                onPress={() => pickImage("id_front")}
                required
              />

              {/* ID Back (Optional) */}
              <UploadCard
                title="ID / Passport (Back)"
                subtitle="Optional but recommended"
                image={idBack}
                onPress={() => pickImage("id_back")}
              />

              {/* Selfie */}
              <UploadCard
                title="Selfie with ID"
                subtitle="Hold your ID next to your face"
                image={selfie}
                onPress={() => pickImage("selfie")}
                required
              />

              {/* Submit Button */}
              <Pressable
                onPress={() => submitVerification()}
                disabled={!idFront || !selfie || isPending}
                className={`mt-4 rounded-xl py-4 items-center ${
                  !idFront || !selfie || isPending
                    ? "bg-slate-300"
                    : "bg-slate-900 active:bg-slate-800"
                }`}
              >
                {isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Submit for Verification
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Reusable Upload Card
function UploadCard({
  title,
  subtitle,
  image,
  onPress,
  required = false,
}: {
  title: string;
  subtitle: string;
  image: string | null;
  onPress: () => void;
  required?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 active:bg-slate-50"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-base font-medium text-slate-900">
            {title} {required && <Text className="text-red-500">*</Text>}
          </Text>
          <Text className="text-sm text-slate-500 mt-0.5">{subtitle}</Text>
        </View>
        <Ionicons name="cloud-upload-outline" size={22} color="#64748b" />
      </View>

      {image ? (
        <Image
          source={{ uri: image }}
          className="w-full h-44 rounded-xl"
          resizeMode="cover"
        />
      ) : (
        <View className="h-32 rounded-xl bg-slate-50 border border-dashed border-slate-200 items-center justify-center">
          <Ionicons name="image-outline" size={32} color="#94a3b8" />
          <Text className="text-sm text-slate-400 mt-2">Tap to upload</Text>
        </View>
      )}
    </Pressable>
  );
}
