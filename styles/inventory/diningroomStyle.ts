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
      fontSize: 25,
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
      width: "100%",
      height: 50,
      justifyContent: "space-evenly",
      alignContent: "center",
      marginTop: 10,
    },
    categoryButton: {
      paddingVertical: 10,
      paddingHorizontal: 45,
      borderRadius: 10,
      backgroundColor: ThemeColors.navSelected,
      justifyContent: "center",
      alignItems: "center",
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
      flex: 1,
      marginTop: 20,
      width: "100%",
      padding: 10,
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
      backgroundColor: ThemeColors.navSelected,
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
    },
    editableCell: {
      flex: 1,
      fontSize: 16,
      textAlign: "center",
      backgroundColor: ThemeColors.text,
      color: ThemeColors.background,
      height: 25,
    },
    bottomButtons: {
      flex: 1,
      alignItems: "flex-start",
      maxHeight: 15,
    },
  });
