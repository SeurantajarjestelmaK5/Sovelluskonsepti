import { useColorScheme } from "react-native";
import { useColors } from "@/constants/Colors"; // Import your dynamic color hook

type ColorsType = {
  light: { [key: string]: string };
  dark: { [key: string]: string };
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ColorsType["light"] & keyof ColorsType["dark"]
) {
  const theme = useColorScheme() ?? "light"; // Get the current theme (light/dark)
  const Colors = useColors(); // Get dynamic Colors object

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps; // Return the color from props if provided
  } else {
    return (Colors[theme] as { [key: string]: string })[colorName]; // Otherwise, fall back to the color in the Colors object
  }
}
