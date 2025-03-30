import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";
import BackButton from "@/components/buttons/BackButton";

export const getTemperatureStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 10,
      backgroundColor: ThemeColors.background,
    },
    header: {
      fontSize: 36,
      color: ThemeColors.tint,
      marginBottom: 15,
      marginTop: 20,
    },
    text: {
      fontSize: 24,
      color: ThemeColors.text,
      marginBottom: 15,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "flex-start",
        width: "100%",
        marginTop: 20,
        marginBottom: 5,
        marginLeft: 10,
    },
    scrollList: {
      backgroundColor: ThemeColors.background,
      alignSelf: "center",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    button: {
      borderRadius: 10,
      backgroundColor: ThemeColors.navSelected,
      justifyContent: "center",
      width: 200,
      height: 70,
      marginHorizontal: 30,
    },
    buttonLabel: {
      color: ThemeColors.text,
      fontSize: 20,
    },
    selectedButton: {
      backgroundColor: ThemeColors.tint,
    },
  });
