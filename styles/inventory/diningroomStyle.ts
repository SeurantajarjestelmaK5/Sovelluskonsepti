import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";
import { ThemeProvider } from "react-native-paper";
const windowHeight = Dimensions.get("window").height;

export const getDiningroomStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 5,
      backgroundColor: ThemeColors.background,
    },

    headerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      width: "90%",
      height: windowHeight * 0.3,
      marginVertical: 30,
      justifyContent: "center",
    },
    button: {
      width: "45%",
      height: "80%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      backgroundColor: ThemeColors.button,
      marginHorizontal: 15,
    },
    buttonText: {
      fontSize: 24,
      color: ThemeColors.text,
      backgroundColor: ThemeColors.button,
      marginTop: 15,
    },
    dateText: {
      fontSize: 24,
      color: ThemeColors.text,
      fontWeight: "bold",
      paddingLeft: 5,
      flex: 1,
    },
    backIcon: {
      color: ThemeColors.icon,
    },
    calendarIcon: {
      fontSize: 25,
      color: ThemeColors.icon,
      paddingRight: 10,
    },
    headerText: {
      fontSize: 32,
      color: ThemeColors.tint,
      fontWeight: "bold",
      alignSelf: "center",
      marginTop: 15,
    },
    oneBox: {
      flexDirection: "row",
      alignItems: "center",
      width: "95%",
      height: 60,
      backgroundColor: ThemeColors.navSelected,
      borderRadius: 20,
      marginTop: 20,
      paddingHorizontal: 10,
      justifyContent: "space-between",
    },
    scrollList: {
      justifyContent: "center",
      alignItems: "center",
    },
    categoryButton: {
      paddingVertical: 20,
      paddingHorizontal: 45,
      borderRadius: 10,
      backgroundColor: ThemeColors.navSelected,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 10,
      marginVertical: 10,
    },
    selectedCategoryButton: {
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
    inventoryTable: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginVertical: 10,
      flex: 1,
    },
    tableHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#ccc",
      backgroundColor: ThemeColors.navDefault,
      width: "100%",
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#e0e0e0",
      width: "100%",
    },
    columnHeader: {
      flex: 1,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      color: ThemeColors.text,
    },
    cellText: {
      flex: 1,
      fontSize: 16,
      textAlign: "center",
      color: ThemeColors.text,
    },
    editableCell: {
      flex: 1,
      fontSize: 16,
      textAlign: "center",
      backgroundColor: ThemeColors.editableField,
      color: ThemeColors.background,
      height: 25,
    },
    bottomButtons: {
      flex: 0.1,
      width: "100%",
      flexDirection: "row-reverse",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    backButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "flex-start",
      width: "100%",
      marginBottom: 10,
      marginLeft: 10,
    },
    trashIcon: {
      fontSize: 24,
      color: "red",
      marginLeft: 10,
    },
    logo: {
      width: "60%",
      height: "20%",
    },
    loadingText: {
      fontSize: 24,
      color: ThemeColors.text,
      marginBottom: 15,
    },
  });
