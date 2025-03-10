import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";
import { WeekCalendar } from "react-native-calendars";

const windowHeight = Dimensions.get("window").height;

export const getCleaningStyles = (ThemeColors: ThemeColors) =>
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
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: ThemeColors.background,
    },
    header: {
      fontSize: 36,
      color: ThemeColors.tint,
      marginBottom: 15,
    },
    kevinButton: {
      backgroundColor: ThemeColors.tint,
      borderRadius: 5,
      justifyContent: "center",
    },
    kevinButtonText: {
      color: ThemeColors.text,
      fontSize: 16,
    },
    modal: {
      flex: 0.9,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.background,
    },
    selectionContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      marginTop: 20,
    },
    sideSelection: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: ThemeColors.navDefault,
      width: "40%",
      alignItems: "center",
    },
    selectedSide: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: ThemeColors.tint,
      width: "40%",
      alignItems: "center",
    },
    text: {
      fontSize: 20,
      color: ThemeColors.text,
    },
    weekCalendar: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: ThemeColors.navDefault,
      padding: 15,
      borderRadius: 10,
    },
  });
