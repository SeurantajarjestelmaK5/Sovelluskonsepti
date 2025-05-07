import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

export const getMeatTempStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 10,
      backgroundColor: ThemeColors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: ThemeColors.background,
      width: "100%",
    },
    header: {
      fontSize: 20,
      color: "white",
      marginBottom: 15,
    },
    input: {
        height: 40,
        width: "100%",
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black',
        backgroundColor: 'white',
        textAlign: "center",
    },
    inputContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    measurement: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: 10,
    },
  });
