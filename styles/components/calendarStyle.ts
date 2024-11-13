import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";

const windowHeight = Dimensions.get("window").height;

export const getCalendarStyles = (ThemeColors: ThemeColors) =>
    StyleSheet.create({
        calendar: {
            width: "90%",
            padding: 10,
            borderRadius: 10,
            marginTop: 40,
            alignSelf: "center",
        },
    });