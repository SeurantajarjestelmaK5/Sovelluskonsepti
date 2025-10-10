import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";
import waste from "@/app/(monitoring)/waste";

const windowHeight = Dimensions.get("window").height;

export const getWasteStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "flex-start",
      width: "100%",
      marginTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    calendar: {
      backgroundColor: ThemeColors.navDefault,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 10,
    },
    container: {
      flex: 1,
      backgroundColor: ThemeColors.background,
      paddingTop: 50,
    },
    content: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 20,
      backgroundColor: ThemeColors.background,
    },
    header: {
      fontSize: 36,
      color: ThemeColors.tint,
      marginBottom: 15,
      textAlign: "center",
      paddingHorizontal: 16,
    },
    logo: {
      width: "60%",
      height: "20%",
    },

    modal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.background,
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: 10,
      marginBottom: 15,
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
    },
    text: {
      fontSize: 24,
      color: ThemeColors.text,
    },
    wasteContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      padding: 13,
      marginBottom: 25,
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
    },
    wasteContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 0.6,
    },
    wasteModal: {
      width: "85%",
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
    },
    wasteModalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    wasteInput: {
      width: "20%",
      backgroundColor: "white",
      color: "black",
    },
    wasteTotal: {
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: 10,
      marginBottom: 15,
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
    },
    totalsContainer: {
      width: "80%",
      backgroundColor: ThemeColors.navDefault,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      marginHorizontal: "auto",
      alignItems: "center",
    },
    totalsTitle: {
      fontSize: 24,
      color: ThemeColors.text,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    totalsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      width: "80%",
    },
    totalsText: {
      fontSize: 18,
      color: ThemeColors.text,
      marginHorizontal: 8,
      marginVertical: 4,
      textAlign: "center",
    },
    totalsButtonContainer: {
      alignItems: "center",
    },
  });
