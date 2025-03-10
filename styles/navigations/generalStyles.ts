import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

export const getGeneralStyles = (ThemeColors: ThemeColors) =>
    StyleSheet.create({
        snackbar: {
            backgroundColor: ThemeColors.tint,
            width: "80%",
            position: "absolute",
            bottom: 100,
            left: "10%",
            right: "10%",
            borderRadius: 10,
            padding: 10,
        
        },
        snackbarText: {
            color: ThemeColors.text,
            fontSize: 18,
        },
    })