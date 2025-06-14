import { Link } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text, View, Image } from "react-native";
import { getInvNavStyle } from "../../styles/navigations/inventoryNavStyle";
import { useThemeColors } from "@/constants/ThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppHeader from "@/components/misc/AppHeader";

export default function InventoryHome() {
  const ThemeColors = useThemeColors();
  const invNavStyle = useMemo(() => getInvNavStyle(ThemeColors), [ThemeColors]);

  return (
    <View style={invNavStyle.container}>
      <AppHeader />
      {/* <Image
        source={require("../../assets/images/k5dark.jpg")}
        style={invNavStyle.logo}
      /> */}
      <View style={invNavStyle.buttonContainer}>
        <Link href="/kitchen" asChild>
          <Pressable style={invNavStyle.button}>
            <Text style={invNavStyle.buttonText}>Keittiö</Text>
            <MaterialCommunityIcons
              name="knife"
              style={invNavStyle.inventoryIcon}
            />
          </Pressable>
        </Link>
      </View>
      <View style={invNavStyle.buttonContainer}>
        <Link href="/diningroom" asChild>
          <Pressable style={invNavStyle.button}>
            <Text style={invNavStyle.buttonText}>Sali</Text>
            <MaterialCommunityIcons
              name="glass-cocktail"
              style={invNavStyle.inventoryIcon}
            />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
