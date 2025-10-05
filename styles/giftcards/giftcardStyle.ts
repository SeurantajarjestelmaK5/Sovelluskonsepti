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
      justifyContent: "center",
      width: "90%",
      marginBottom: 20,
    },
    addButton: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      padding: 5,
      backgroundColor: ThemeColors.tint,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      maxWidth: "15%",
      minWidth: "15%",
    },
    giftcard: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: 80,
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
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
    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: ThemeColors.background,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.navDefault,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: ThemeColors.text,
      flex: 1,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: ThemeColors.tint,
    },
    modalContent: {
      flex: 1,
      padding: 20,
    },
    formContainer: {
      flex: 1,
    },
    textInput: {
      marginBottom: 15,
    },
    amountInput: {
      width: "80%",
      textAlign: "center",
      marginHorizontal: 10,
    },
    amountInputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "15%",
      marginVertical: 10,
    },
    helpText: {
      fontSize: 14,
      color: ThemeColors.text,
      opacity: 0.7,
      fontStyle: "italic",
      marginTop: 10,
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: ThemeColors.navDefault,
    },
    modalButton: {
      flex: 1,
      marginHorizontal: 10,
      borderRadius: 10,
    },
    submitButton: {
      backgroundColor: ThemeColors.tint,
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: "600",
    },
    smallModalContainer: {
      flex: 0.4,
      backgroundColor: ThemeColors.background,
      padding: 20,
      borderRadius: 10,
    },
    spendAmountInput: {
      marginVertical: 15,
      width: "30%",
      alignSelf: "center",
      textAlign: "center",
    },
    // Tab styles
    tabContainer: {
      flexDirection: "row",
      marginBottom: 20,
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: ThemeColors.tint,
    },
    inactiveTab: {
      backgroundColor: "transparent",
    },
    tabText: {
      fontSize: 16,
      fontWeight: "600",
      color: ThemeColors.text,
    },
    activeTabText: {
      color: "white",
    },
    inactiveTabText: {
      color: ThemeColors.text,
      opacity: 0.7,
    },
    // Dialog styles
    dialogText: {
      fontSize: 18,
      color: ThemeColors.text,
    },
    valueHighlight: {
      color: "green",
      fontWeight: "bold",
      fontSize: 20,
    },
    actionButton: {
      borderRadius: 20,
      width: "20%",
      color: "white",
    },
    helperText: {
      fontSize: 16,
      color: "red",
    },
  });
