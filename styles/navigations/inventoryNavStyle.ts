// invNavStyle.js
import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";
const windowHeight = Dimensions.get("window").height;


export const getInvNavStyle = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: ThemeColors.background,
    },
    buttonContainer: {
      width: "70%",
      height: windowHeight * 0.28,
      marginVertical: 30,
      justifyContent: "center",
    },
    button: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 2,
      borderColor: ThemeColors.navSelected,
      backgroundColor: ThemeColors.button,
    },
    buttonText: {
      fontSize: 24,
      color: ThemeColors.text, 
      marginBottom: 15,
    },
    inventoryIcon: {
      color: ThemeColors.icon,
      fontSize: 50,
      paddingTop: 25,
    },
    logo: {
      width: "30%",
      height: "10%",
      borderRadius: 20,
    }
  });
