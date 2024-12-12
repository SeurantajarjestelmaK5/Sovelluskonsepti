import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;

export const getModalStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "80%",
      backgroundColor: ThemeColors.background,
      padding: 20,
      borderRadius: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: ThemeColors.text,
    },
    input: {
      paddingVertical: 8,
      marginBottom: 12,
    },
    dropdownButton: {
      marginBottom: 10,
      borderRadius: 15,
      backgroundColor: "white",
    },
    dropdownList: {
      borderWidth: 1,
      borderColor: "#ccc",
      maxHeight: 100,
      marginBottom: 10,
      borderRadius: 5,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: ThemeColors.text,
    },
    radioButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    radioButton: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#333",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    radioButtonSelected: {
      backgroundColor: "#333",
    },
    radioButtonInner: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: ThemeColors.tint,
    },
    text: {
      fontSize: 24,
      color: ThemeColors.tint,
      marginBottom: 15,
    },
  });
