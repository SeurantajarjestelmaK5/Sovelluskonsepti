/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#15137e';
const tintColorDark = '#1d52a3';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#051d30',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#000000',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#d7e9f8',
    tabIconSelected: tintColorDark,
  },
  nav: {
    navDefault : '#706F6F',
    navSelected : '#c2bebe'
  }
};
