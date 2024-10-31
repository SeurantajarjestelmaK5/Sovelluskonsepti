import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

export const getButtonStyle = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    button: {
      backgroundColor: ThemeColors.button,
      borderRadius: 10,
    },
    label: {
      fontSize: 21,
      color: ThemeColors.text,
    },
    inner: {
      justifyContent: "space-between",
      alignContent: "center",
      padding: 5,
    },
  });
