import { useMemo } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

import { useThemeColors } from "@/constants/ThemeColors";
import { getButtonStyle } from "@/styles/components/backButtonStyle";

export default function BackButton() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getButtonStyle(ThemeColors), [ThemeColors]);

  // Tätä ku käyttää niin vois wrapata Viewillä ja antaa:
  //       flexDirection: "row",
  //       justifyContent: "space-between",
  //       alignContent: "flex-start",
  //       width: "100%",
  //       marginTop: 20,
  // menee suoraan vasempaan alakulmaan
  return (
    <>
      <Link href="../">
        <Button
          children="Takaisin"
          mode="contained"
          labelStyle={styles.label}
          contentStyle={styles.inner}
          style={styles.button}
          icon={() => (
            <MaterialCommunityIcons
              name="arrow-left-bold"
              size={23}
              color={ThemeColors.text}
            />
          )}
        />
      </Link>
    </>
  );
}
