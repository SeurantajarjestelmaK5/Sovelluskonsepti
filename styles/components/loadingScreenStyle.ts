import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;

export const useLoadingScreenStyle = (ThemeColors: ThemeColors) =>
    StyleSheet.create({
        container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ThemeColors.background,
        },
        logo: {
        width: "60%",
        height: "20%",
        },
        text: {
        fontSize: 24,
        color: ThemeColors.text,
        marginBottom: 15,
        marginTop: 15,
        },
    });