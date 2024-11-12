import { useMemo } from 'react';
import {View, Image, Text, ActivityIndicator} from 'react-native';
import { useColorScheme } from 'react-native';
import { useThemeColors } from '@/constants/ThemeColors';
import { useLoadingScreenStyle } from '@/styles/components/loadingScreenStyle';


export default function LoadingScreen() {
    const ThemeColors = useThemeColors();
    const colorScheme = useColorScheme();
    const styles = useMemo(() => useLoadingScreenStyle(ThemeColors), [ThemeColors]);


    return (
      <View style={{ ...styles.container }}>
        <Image
          source={
            colorScheme === "light"
              ? require("../assets/images/k5light.png")
              : require("../assets/images/k5dark.jpg")
          }
          style={styles.logo}
        />
        <Text style={styles.text}>Ladataan...</Text>
        <ActivityIndicator size="large" color={ThemeColors.tint} />
      </View>
    );
}