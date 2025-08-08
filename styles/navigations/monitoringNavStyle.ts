import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";
const windowHeight = Dimensions.get('window').height;

export const getMonitoringNavStyle = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: ThemeColors.background,
    },
    buttonContainer: {
      flexDirection: "row",
      width: "90%",
      height: windowHeight * 0.3,
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      width: "45%",
      height: "80%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 2,
      borderColor: ThemeColors.navSelected,
      backgroundColor: ThemeColors.button,
      marginHorizontal: 15,
    },
    buttonText: {
      fontSize: 24,
      color: ThemeColors.text,
      marginBottom: 15,
    },
    monitoringIcon: {
      color: ThemeColors.icon,
      fontSize: 50,
      marginTop: 25,
    },
  });
