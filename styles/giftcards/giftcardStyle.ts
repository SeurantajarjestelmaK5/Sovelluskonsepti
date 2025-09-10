import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

export const getGiftcardStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 5,
      paddingTop: "10%",
      backgroundColor: ThemeColors.background,
    },
    addButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "90%",
      marginBottom: 20,
    },
    addButton: {
      width: "45%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      padding: 5,
      marginHorizontal: 15,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      minWidth: "15%",
    },
    giftcard: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      minHeight: 80,
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
      marginBottom: 10,
    },
    cardAttribute: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 15,
    },
    cardLabel: {
      fontSize: 22,
      color: ThemeColors.text,
    },
    attributeIcon: {
      fontSize: 28,
      marginBottom: 5,
      color: ThemeColors.tint,
    },
    deleteButton: {
      padding: 5,
      borderWidth: 3,
      borderColor: "green",
      borderRadius: 10,
      backgroundColor: "green",
    },
    deleteIcon: {
      fontSize: 32,
      color: "white",
    },
    spendButton: {
      padding: 5,
      borderWidth: 3,
      borderColor: ThemeColors.tint,
      borderRadius: 10,
      backgroundColor: ThemeColors.tint,
    },
    spendIcon: {
      fontSize: 32,
      color: "white",
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      marginTop: 50,
    },
    noResultsText: {
      fontSize: 18,
      color: ThemeColors.text,
      textAlign: "center",
      opacity: 0.7,
    },
  });
