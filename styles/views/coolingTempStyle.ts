import {StyleSheet} from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

export const getCoolingTempStyles = (ThemeColors: ThemeColors) =>
    StyleSheet.create({
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
    });