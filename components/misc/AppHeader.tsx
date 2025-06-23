import { View, Image, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors } from "@/constants/ThemeColors";

export default function AppHeader() {
  const router = useRouter();
  const ThemeColors = useThemeColors();

  const handleCogPress = () => {
    router.push("/(settings)");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 20,
      }}
    >
      <MaterialCommunityIcons
        name="cog"
        size={40}
        color={ThemeColors.tint}
        onPress={handleCogPress}
      />
      <Image
        source={require("../../assets/images/täppä_hd_thick.png")}
        style={{ width: 150, height: 150 }}
      />
      <View style={{ width: 40 }} /> {/* Spacer to balance the layout */}
    </View>
  );
}
