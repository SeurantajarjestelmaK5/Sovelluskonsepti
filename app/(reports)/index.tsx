import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { getReportNavStyle } from "@/styles/navigations/reportNavStyle";
import { useThemeColors } from "@/constants/ThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import AppHeader from "@/components/misc/AppHeader";

export default function ReportsHome() {
  const ThemeColors = useThemeColors();
  const reportNavStyle = useMemo(
    () => getReportNavStyle(ThemeColors),
    [ThemeColors]
  );

  return (
    <View style={reportNavStyle.container}>
      <AppHeader />
      <View style={reportNavStyle.button}>
        <Text style={reportNavStyle.buttonText}>Inventaario</Text>
        <MaterialCommunityIcons
          name="arrow-right"
          style={reportNavStyle.reportIcon}
        />
      </View>
      <View style={reportNavStyle.button}>
        <Text style={reportNavStyle.buttonText}>Jätteet</Text>
        <MaterialCommunityIcons
          name="arrow-right"
          style={reportNavStyle.reportIcon}
        />
      </View>
      <View style={reportNavStyle.button}>
        {/* <MaterialCommunityIcons
          name="thermometer"
          style={reportNavStyle.reportIcon}
        /> */}
        <Text style={reportNavStyle.buttonText}>Lämpötilat</Text>
        <MaterialCommunityIcons
          name="arrow-right"
          style={reportNavStyle.reportIcon}
        />
      </View>
    </View>
  );
}
