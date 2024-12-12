import { useThemeColors } from "@/constants/ThemeColors";
import { useLoadingScreenStyle } from "@/styles/components/loadingScreenStyle";
import { useMemo } from "react";
import { ActivityIndicator, Text } from "react-native-paper"




export default function SmallLoadingIndicator(){
    const ThemeColors = useThemeColors();
    const styles = useMemo(
        () => useLoadingScreenStyle(ThemeColors),
        [ThemeColors]
      );
    return (
        <>
        <Text style={styles.text}>Ladataan...</Text>
        <ActivityIndicator size="large" color={ThemeColors.tint} />
        </>
    )
}