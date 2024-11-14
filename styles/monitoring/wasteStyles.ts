import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;



export const getWasteStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "flex-start",
      width: "100%",
      marginTop: 20,
    },
    calendar: {
      width: "100%",
      backgroundColor: ThemeColors.navDefault,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 10,
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
      padding: 16,
      backgroundColor: ThemeColors.background,
    },
    header: {
      fontSize: 36,
      color: ThemeColors.tint,
      marginBottom: 15,
    },
    logo: {
      width: "60%",
      height: "20%",
    },
    modal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.background,
    },
    text: {
      fontSize: 24,
      color: ThemeColors.text,
      marginBottom: 15,
    },
    wasteContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: 10,
      margin: 5,
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
    }
  });
