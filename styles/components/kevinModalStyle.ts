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
    dateFilterContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    flatlist: {
      flexGrow: 0,
    },
    flatlistContainer: {
      width: "100%",
      maxHeight: 200,
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
    label: {
      color: ThemeColors.text,
      fontSize: 16,
      marginBottom: 5,
    },
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay effect
    },
    picker: {
      width: "80%",
      backgroundColor: ThemeColors.text,
      color: "black",
    },
    pickerItem: {
      backgroundColor: ThemeColors.text,
      color: "black",
    },
    modalContainer: {
      width: "80%",
      backgroundColor: ThemeColors.background,
      borderRadius: 10,
      alignItems: "center",
      paddingBottom: 20,
    },
    tabButton: {
      padding: 20,
      backgroundColor: ThemeColors.navDefault,
      width: "50%",
      justifyContent: "center",
      alignItems: "center",
    },
    tabButtonActive: {
      padding: 20,
      backgroundColor: ThemeColors.background,
      width: "50%",
      justifyContent: "center",
      alignItems: "center",
    },
    tabHeader: {
      color: ThemeColors.text,
      fontSize: 20,
    },
    tabContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 40,
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
    },
    tasksContainer: {
      width: "60%",
      maxHeight: 300,
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "space-between",
      backgroundColor: ThemeColors.background,
      borderRadius: 10,
      padding: 20,
      margin: 10,
      borderWidth: 1,
      borderColor: ThemeColors.navSelected,
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
