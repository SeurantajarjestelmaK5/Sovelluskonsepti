import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";


export const getKevinModalStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    closeButton: {
        backgroundColor: ThemeColors.tint,
        borderRadius: 5,
        justifyContent: "center",
        width: "50%",
        marginTop: 20,
        },
    closeButtonText: {
        color: ThemeColors.text,
        fontSize: 16,
    },
    checkboxLabel: {
        color: ThemeColors.text,
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        width: "80%",
        marginBottom: 20,
    },
    inputContainer: {
        width: "50%",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay effect
    },
    modalContainer: {
      width: "80%",
      padding: 20,
      backgroundColor: ThemeColors.background,
      borderRadius: 10,
      alignItems: "center",
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      color: ThemeColors.text,
      marginBottom: 20,
    },
    tasksContainer: {
        width: "60%",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-between",
        backgroundColor: ThemeColors.background,
        borderRadius: 10,
        padding: 20,
    },
    task: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: ThemeColors.background,
        borderRadius: 10,
        padding: 5,
    },
    taskText: {
        color: ThemeColors.text,
        fontSize: 16,
    },
  });