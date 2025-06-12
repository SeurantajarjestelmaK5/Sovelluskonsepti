/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#062238";
const tintColorDark = "#8F3FFF";

export const Colors = {
  light: {
    text: "#000000",
    background: "#ffffff",
    tint: tintColorLight,
    icon: tintColorLight,
    tabIconDefault: "#2E2E2EFF",
    tabIconSelected: tintColorLight,
    button: "#686868",
    navDefault: "#706F6F",
    navSelected: "#c2bebe",
  },
  dark: {
    text: "#ffffff",
    background: "#1b1a1a",
    tint: tintColorDark,
    icon: tintColorDark,
    tabIconDefault: "#C7CED4FF",
    tabIconSelected: tintColorDark,
    button: "#383838FF",
    navDefault: "#414141",
    navSelected: "#969696FF",
  },
};
