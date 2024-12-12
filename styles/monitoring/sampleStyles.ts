import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;

export const getSampleStyles = (ThemeColors: ThemeColors) =>
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
    button: {
      paddingVertical: 20,
      paddingHorizontal: 45,
      borderRadius: 10,
      backgroundColor: ThemeColors.navSelected,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
      marginLeft: 25,
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#e0e0e0",
      width: "100%",
    },
    calendarButton: {
      flexDirection: "row",
      alignItems: "center",
      width: "60%",
      height: 60,
      backgroundColor: ThemeColors.navSelected,
      borderRadius: 20,
      marginTop: 20,
      paddingHorizontal: 10,
      justifyContent: "space-between",
    },
  });
