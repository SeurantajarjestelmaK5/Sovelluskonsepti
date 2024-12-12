import { useColorScheme } from "react-native";
import { Colors } from "./Colors";

export interface ThemeColors {
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  text: string;
  background: string;
  navDefault: string;
  navSelected: string;
  button: string;
  editableField: string;
};

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
    button: colorScheme === "light" ? Colors.light.button : Colors.dark.button,
    background:
      colorScheme === "light"
        ? Colors.light.background
        : Colors.dark.background,
    editableField:
      colorScheme === "light"
        ? Colors.dark.background
        : Colors.light.background,
    navDefault:
      colorScheme === "light"
        ? Colors.light.navDefault
        : Colors.dark.navDefault,
    navSelected:
      colorScheme === "light"
        ? Colors.light.navSelected
        : Colors.dark.navSelected,
  };
};
