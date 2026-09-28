import { Image, Text, TouchableOpacity, View } from "react-native";

// We accept props so the text and image can change for different banners
export default function PromoBanner({
  title = "Discover Authentic Crafts",
  subtitle = "Direct from African creators",
  bigText = "Earn 5% SKR",
  buttonText = "Explore Now",
  imageSource,
}: {
  title?: string;
  subtitle?: string;
  bigText?: string;
  buttonText?: string;
  imageSource: any;
}) {
  return (
    <>
      <View className="bg-green-100 rounded-3xl p-5 flex-row mb-3 overflow-hidden">
        <View className="flex-1 justify-center">
          <Text className="text-sm font-semibold text-green-800">{title}</Text>
          <Text className="text-xs text-green-500 mt-0.5">{subtitle}</Text>
          <Text className="text-3xl font-extrabold text-green-800 my-1.5">
            {bigText}
          </Text>

          <TouchableOpacity className="bg-white px-4 py-2 rounded-full self-start mt-1.5">
            <Text className="text-sm font-semibold text-green-800">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-24 items-center justify-center">
          <View className="w-24 h-24">
            <Image
              source={imageSource}
              resizeMode="contain"
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                top: 2,
                left: -45,
                transform: [{ scale: 1.6 }],
              }}
            />
          </View>
        </View>
      </View>

      {/* Dots */}
      <View className="flex-row justify-center gap-1.5 mb-7">
        <View className="w-4 h-1.5 rounded-full bg-green-500" />
        <View className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        <View className="w-1.5 h-1.5 rounded-full bg-slate-300" />
      </View>
    </>
  );
}
