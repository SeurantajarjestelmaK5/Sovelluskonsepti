import { useState } from "react";
import { Appearance, Switch } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Text, View, useColorScheme } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { Colors } from "@/constants/Colors";
import { Button } from "react-native-paper";

export default function SettingsScreen() {
  const [switchOn, setSwitchOn] = useState(false);
  const colorScheme = useColorScheme();
  const ThemeColors = useThemeColors();

  const switchHandler = () => {
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === "light") {
      Appearance.setColorScheme("dark");
    } else {
      Appearance.setColorScheme("light");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
        backgroundColor:
          colorScheme === "light"
            ? Colors.light.background
            : Colors.dark.background,
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          width: "80%",
        }}
      >
        <ThemedText>Dark mode</ThemedText>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={true ? ThemeColors.tint : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={switchHandler}
          value={colorScheme === "dark" ? true : false}
        />
      </View>
    </View>
  );
}
