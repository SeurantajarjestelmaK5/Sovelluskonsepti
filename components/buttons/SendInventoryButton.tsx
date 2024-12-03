import React, { useMemo } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeColors";
import { getButtonStyle } from "@/styles/components/backButtonStyle";

interface SendInventoryButtonProps {
    onClick: () => void; // Function to handle button press
}

const SendInventoryButton: React.FC<SendInventoryButtonProps> = ({ onClick }) => {
    const ThemeColors = useThemeColors();
    const buttonStyles = useMemo(() => getButtonStyle(ThemeColors), [ThemeColors]);

    return (
        <Pressable
            onPress={onClick}
            style={[buttonStyles.button, {flexDirection: "row", alignItems: "center"}]} // Apply flex styling
        >
            <MaterialCommunityIcons name="plus-thick" size={46} />
            <Text style={[buttonStyles.label, {paddingRight : 15, paddingLeft: 8} ]}>Lähetä Invis</Text>
        </Pressable>
    );
};

export default SendInventoryButton;
