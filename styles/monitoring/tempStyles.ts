import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;

export const getTempStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "flex-start",
      width: "100%",
      marginTop: 20,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: ThemeColors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: ThemeColors.background,
    },
    header: {
      fontSize: 36,
      color: ThemeColors.tint,
      marginBottom: 15,
    },
    text: {
      fontSize: 24,
      color: ThemeColors.text,
      marginBottom: 15,
    },
  });
