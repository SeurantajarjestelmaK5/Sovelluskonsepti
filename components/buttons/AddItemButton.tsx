import { useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getButtonStyle } from "@/styles/components/backButtonStyle";
interface AddItemButtonProps {
    onClick: () => void; // Callback function to handle button click
}

const AddItemButton: React.FC<AddItemButtonProps> = ({ onClick }) => {
    const ThemeColors = useThemeColors();
    const buttonStyles = useMemo(() => getButtonStyle(ThemeColors), [ThemeColors]);

    return (
        <Pressable
            onPress={onClick} 
            style={[buttonStyles.button, {flexDirection: "row", alignItems: "center", padding: 10}]} // Apply flex styling
        >
            <MaterialCommunityIcons
                name="plus-thick"
                size={46}
                color={ThemeColors.tint}
            />
                <Text style={[buttonStyles.label, {paddingRight : 15, paddingLeft: 8} ]}>Uusi tuote</Text>
        </Pressable>
    );
};

export default AddItemButton;
