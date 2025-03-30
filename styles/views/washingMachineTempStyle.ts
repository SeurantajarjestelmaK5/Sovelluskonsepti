import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

export const getWashingTempStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 10,
      backgroundColor: ThemeColors.background,
      marginTop: 20,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: ThemeColors.background,
      width: "100%",
    },
    calendarButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 10,
        width: 150,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "80%",
    },
    iconLabel: {
      color: ThemeColors.text,
      fontSize: 16,
      textAlign: "center",
      marginTop: 5,
    },
    input: {
        width: 150,
        backgroundColor: ThemeColors.editableField,
        borderRadius: 5,
        marginTop: 10,
    },
  });
