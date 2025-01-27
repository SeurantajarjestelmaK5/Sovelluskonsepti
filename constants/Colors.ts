import { useColorContext } from "./ColorContext";

export const useColors = () => {
  const { tintLight, tintDark } = useColorContext();

  return {
    light: {
      text: "#000000",
      background: "#ffffff",
      tint: tintLight,
      icon: tintLight,
      tabIconDefault: "#252525",
      tabIconSelected: tintLight,
      button: "#686868",
      navDefault: "#706F6F",
      navSelected: "#c2bebe",
    },
    dark: {
      text: "#ffffff",
      background: "#1b1a1a",
      tint: tintDark,
      icon: tintDark,
      tabIconDefault: "#d7e9f8",
      tabIconSelected: tintDark,
      button: "#414141",
      navDefault: "#414141",
      navSelected: "#adadad",
    },
  };
};
