import {StyleSheet} from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

export const getCoolingTempStyles = (ThemeColors: ThemeColors) =>
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
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "90%",
      justifyContent: "space-between",
    },
    inputContainer: {
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,
    },
    input: {
      width: 150,
      backgroundColor: ThemeColors.editableField,
      borderRadius: 5,
      marginTop: 10,
    },
    label: {
      fontSize: 16,
      color: ThemeColors.text,
      marginVertical: 10,
    },
    calendarButton: {
      backgroundColor: "white",
      borderRadius: 5,
      marginTop: 10,
      width: 150,
      height: 55,
      justifyContent: "center",
      alignItems: "center",
    },
    saveButton: {
      backgroundColor: ThemeColors.tint,
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 30,
      width: 180,
      height: 55,
      justifyContent: "center",
      alignItems: "center",
    },
  });