import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;

export const getTempStyles = (ThemeColors: ThemeColors) =>
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
      padding: 10,
      backgroundColor: ThemeColors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: ThemeColors.background,
      width: "100%",
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
    scrollList: {
      alignSelf: "center",
      paddingLeft: 120,
      backgroundColor: ThemeColors.background,
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
    selectedButton: {
      backgroundColor: ThemeColors.tint,
    },
    categoryText: {
      fontSize: 18,
      color: ThemeColors.text,
      fontWeight: "bold",
    },
    selectedCategoryText: {
      color: ThemeColors.background,
    },
    table: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: ThemeColors.background,
      width: "100%",
      height: windowHeight * 0.2,
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "85%",
    },
    calendarButton: {
      flexDirection: "row",
      alignItems: "center",
      width: "60%",
      height: 60,
      backgroundColor: ThemeColors.navSelected,
      borderRadius: 15,
      marginBottom: 30,
      paddingHorizontal: 10,
      justifyContent: "space-between",
    },
    calendarDisplayButton: {
      paddingVertical: 20,
      paddingHorizontal: 45,
      borderRadius: 5,
      backgroundColor: ThemeColors.text,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      height: 50,
      width: "50%",
      backgroundColor: ThemeColors.navSelected,
      borderRadius: 20,
      marginTop: 20,
      paddingHorizontal: 10,
      alignItems: "center",
      alignSelf: "center",
      paddingLeft: 30,
      paddingTop: 5,
    },
    textInputsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 20,
      marginBottom: 20,
    },
    textInput: {
      width: "30%",
      alignSelf: "center",
    },
  });
