import React, { useMemo } from "react";
import { getMonitoringNavStyle } from "@/styles/navigations/monitoringNavStyle";
import { useThemeColors } from "@/constants/ThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import AppHeader from "@/components/misc/AppHeader";

export default function MonitorHome() {
  const ThemeColors = useThemeColors();
  const monitoringNavStyle = useMemo(
    () => getMonitoringNavStyle(ThemeColors),
    [ThemeColors]
  );

  return (
    <View style={monitoringNavStyle.container}>
      <AppHeader />
      <View style={{...monitoringNavStyle.buttonContainer}}>
        <Link href="/samples" asChild>
          <Pressable style={monitoringNavStyle.button}>
            <Text style={monitoringNavStyle.buttonText}>Näytteenotto</Text>
            <MaterialCommunityIcons
              name="test-tube"
              style={monitoringNavStyle.monitoringIcon}
            />
          </Pressable>
        </Link>
        <Link href="/temperatures_fixed" asChild>
          <Pressable style={monitoringNavStyle.button}>
            <Text style={monitoringNavStyle.buttonText}>Lämpötilat</Text>
            <MaterialCommunityIcons
              name="thermometer"
              style={monitoringNavStyle.monitoringIcon}
            />
          </Pressable>
        </Link>
      </View>
      <View style={monitoringNavStyle.buttonContainer}>
        <Link href="/cleaning" asChild>
          <Pressable style={monitoringNavStyle.button}>
            <Text style={monitoringNavStyle.buttonText}>Viikkosiivous</Text>
            <MaterialCommunityIcons
              name="spray-bottle"
              style={monitoringNavStyle.monitoringIcon}
            />
          </Pressable>
        </Link>
        <Link href="/waste" asChild>
          <Pressable style={monitoringNavStyle.button}>
            <Text style={monitoringNavStyle.buttonText}>Jätteet</Text>
            <MaterialCommunityIcons
              name="trash-can-outline"
              style={monitoringNavStyle.monitoringIcon}
            />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
