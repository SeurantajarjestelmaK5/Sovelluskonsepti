import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;

export const getFeedBackStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 20,
      marginBottom: 20,
    },
    buttonText: {
      fontSize: 20,
      color: "white",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
      padding: 10,
      marginTop: 50,
    },
    dropdownButton: {
        width: "80%",
        height: 70,
        backgroundColor: "white",
        borderRadius: 20,
        marginBottom: 20,
    },
    dropdownItem: {
        color: "black",
        fontSize: 20,
    },
    header: {
      fontSize: 30,
      color: "#1f81cc",
      marginBottom: 20,
    },
    inner: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 23,
      color: "white",
      textAlign: "center",
    },
    textContent: {
      width: "90%",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    textInput: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 20,
        marginBottom: 20,
    }
  });
