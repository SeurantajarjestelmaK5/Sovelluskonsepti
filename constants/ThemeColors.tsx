import { useColorScheme } from "react-native";
import { Colors } from "./Colors";

export const useThemeColors = () => {
  const colorScheme = useColorScheme();

  return {
    tint: colorScheme === "light" ? Colors.light.tint : Colors.dark.tint,
    icon: colorScheme === "light" ? Colors.light.icon : Colors.dark.icon,
    tabIconDefault:
      colorScheme === "light"
        ? Colors.light.tabIconDefault
        : Colors.dark.tabIconDefault,
    tabIconSelected:
      colorScheme === "light"
        ? Colors.light.tabIconSelected
        : Colors.dark.tabIconSelected,
    text: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
    background:
      colorScheme === "light"
        ? Colors.light.background
        : Colors.dark.background,
    navDefault:
      colorScheme === "light"
        ? Colors.nav.navDefault
        : Colors.nav.navDefault,
    navSelected:
      colorScheme === "light"
        ? Colors.nav.navSelected
        : Colors.nav.navSelected,
  };
};
