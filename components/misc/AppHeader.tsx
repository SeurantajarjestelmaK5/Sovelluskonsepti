import { View, Image, Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors } from "@/constants/ThemeColors";
import * as Updates from "expo-updates";
import { useState } from "react";
import { useNavigationState } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";

export default function AppHeader() {
  const router = useRouter();
  const ThemeColors = useThemeColors();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [isInSettings, setIsInSettings] = useState(false);
  const navigationState = useNavigationState((state) => state);

  const handleCogPress = () => {
    checkForUpdates();
    if (isInSettings) {
      // Navigate back to the previous screen
      if (navigationState.routes.length > 1) {
        router.back(); // Or use router.pop() for stack-based navigation
      }
      setIsInSettings(false);
    } else {
      // Navigate to the settings screen
      router.push("/(settings)");
      setIsInSettings(true);
    }
  };

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();

        // Show the Snackbar
        setSnackbarVisible(true);

        // Delay the reload to allow the Snackbar to be visible
        setTimeout(async () => {
          await Updates.reloadAsync();
        }, 8000); // Delay for 8 seconds
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    }
  };

  return (
    <>
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
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "OK",
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
        style={{
          backgroundColor: ThemeColors.tint,
          borderRadius: 10,
          padding: 10,
          margin: 10,
        }}
        elevation={1}
      >
        <Text style={{ color: ThemeColors.text }}>
          Sovellusta päivitetään, odota hetki...
        </Text>
      </Snackbar>
    </>
  );
}
