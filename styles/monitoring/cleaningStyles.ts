import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;


export const getCleaningStyle = (ThemeColors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: ThemeColors.background,
    }
});