import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";
import { Theme } from "@react-navigation/native";

export const getCleaningListStyles = (ThemeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
      color: ThemeColors.text,
    },
    radioButtonContainer: {
      flexDirection: "row",
    },
    taskItem: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      width: Dimensions.get("window").width - 100,
      backgroundColor: ThemeColors.navDefault,
      borderWidth: 1,
      borderColor: "#ccc",
    },
    taskItemWashing: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      width: Dimensions.get("window").width - 100,
      backgroundColor: ThemeColors.navDefault,
      borderWidth: 1,
      borderColor: "#ccc",
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    taskCompleted: {
      backgroundColor: "#05b82e",
      borderColor: "#c3e6cb",
    },
    taskName: {
      fontSize: 16,
      color: ThemeColors.text,
    },
    taskDate: {
      fontSize: 12,
      color: "#b60505",
    },
  });
